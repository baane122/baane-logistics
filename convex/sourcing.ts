import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(v.union(
      v.literal("Received"), v.literal("Searching Suppliers"), v.literal("Verifying Samples"),
      v.literal("Quoted"), v.literal("Completed"), v.literal("Cancelled")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("sourcingRequests")
        .withIndex("by_status", (ix) => ix.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 100);
    }
    return await ctx.db
      .query("sourcingRequests")
      .order("desc")
      .take(args.limit || 100);
  },
});

export const getById = query({
  args: { id: v.id("sourcingRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    productType: v.string(),
    quantity: v.string(),
    budget: v.optional(v.string()),
    targetMarket: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const id = await ctx.db.insert("sourcingRequests", {
      ...args,
      status: "Received",
      notes: undefined,
      createdAt: now,
      updatedAt: now,
    });
    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    id: v.id("sourcingRequests"),
    status: v.optional(v.union(
      v.literal("Received"), v.literal("Searching Suppliers"), v.literal("Verifying Samples"),
      v.literal("Quoted"), v.literal("Completed"), v.literal("Cancelled")
    )),
    notes: v.optional(v.string()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    productType: v.optional(v.string()),
    quantity: v.optional(v.string()),
    budget: v.optional(v.string()),
    targetMarket: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: new Date().toISOString() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("sourcingRequests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("sourcingRequests").collect();
    return {
      total: all.length,
      received: all.filter((r) => r.status === "Received").length,
      searching: all.filter((r) => r.status === "Searching Suppliers").length,
      verifying: all.filter((r) => r.status === "Verifying Samples").length,
      quoted: all.filter((r) => r.status === "Quoted").length,
      completed: all.filter((r) => r.status === "Completed").length,
    };
  },
});
