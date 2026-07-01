import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Return keys without exposing the actual secret values
    const keys = await ctx.db.query("apiKeys").collect();
    return keys.map((k) => ({
      ...k,
      key: k.key.slice(0, 8) + "••••" + k.key.slice(-4),
    }));
  },
});

export const getDecrypted = query({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    const key = await ctx.db.get(args.id);
    if (!key) throw new Error("API key not found");
    return key;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    key: v.string(),
    provider: v.string(),
    scopes: v.array(v.string()),
    isActive: v.boolean(),
    expiresAt: v.optional(v.string()),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("apiKeys", { ...args, createdAt: now, updatedAt: now });
  },
});

export const update = mutation({
  args: {
    id: v.id("apiKeys"),
    name: v.optional(v.string()),
    key: v.optional(v.string()),
    provider: v.optional(v.string()),
    scopes: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
    expiresAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: new Date().toISOString() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    const key = await ctx.db.get(args.id);
    if (!key) throw new Error("Key not found");
    await ctx.db.patch(args.id, {
      isActive: !key.isActive,
      updatedAt: new Date().toISOString(),
    });
    return await ctx.db.get(args.id);
  },
});

export const updateLastUsed = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { lastUsed: new Date().toISOString() });
  },
});
