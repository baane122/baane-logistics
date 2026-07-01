import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Simple SHA-256 hash for password storage (in production, use bcrypt)
async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const createAdmin = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.optional(v.union(v.literal("admin"), v.literal("staff"), v.literal("viewer"))),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) throw new Error("User already exists");

    const passwordHash = await hashPassword(args.password);
    const now = new Date().toISOString();

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      passwordHash,
      role: args.role || "staff",
      isActive: true,
      lastLogin: undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) throw new Error("Invalid email or password");
    if (!user.isActive) throw new Error("Account is disabled");

    const passwordHash = await hashPassword(args.password);
    if (user.passwordHash !== passwordHash) throw new Error("Invalid email or password");

    // Update last login
    await ctx.db.patch(user._id, { lastLogin: new Date().toISOString() });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
});

export const getCurrentUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("staff"), v.literal("viewer"))),
    isActive: v.optional(v.boolean()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, password, ...fields } = args;
    const updateData: Record<string, any> = { ...fields, updatedAt: new Date().toISOString() };
    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }
    await ctx.db.patch(userId, updateData);
    return await ctx.db.get(userId);
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  },
});
