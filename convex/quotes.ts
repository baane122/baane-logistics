import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(v.union(
      v.literal("Pending Analysis"), v.literal("Offered"),
      v.literal("Approved"), v.literal("Rejected")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("cargoQuotes")
        .withIndex("by_status", (ix) => ix.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 100);
    }
    return await ctx.db
      .query("cargoQuotes")
      .order("desc")
      .take(args.limit || 100);
  },
});

export const getById = query({
  args: { id: v.id("cargoQuotes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    serviceType: v.union(v.literal("Sea Cargo"), v.literal("Air Cargo")),
    cargoType: v.string(),
    origin: v.string(),
    destination: v.union(
      v.literal("Berbera Port"), v.literal("Hargeisa Hub"),
      v.literal("Burao Depot"), v.literal("Mogadishu")
    ),
    weight: v.string(),
    volume: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    // Auto-calculate estimated cost
    const w = parseFloat(args.weight) || 0;
    const v = parseFloat(args.volume) || 0;
    let cost = 0;
    let duration = "";
    if (args.serviceType === "Air Cargo") {
      cost = w * 4.8;
      duration = "3 - 6 Days Express Air";
    } else {
      cost = v * 85;
      if (cost < 950) cost = 950;
      duration = "22 - 28 Days Maritime Cargo";
    }
    if (args.cargoType === "Electronics") cost *= 1.1;

    const id = await ctx.db.insert("cargoQuotes", {
      ...args,
      estimatedCost: `$${Math.round(cost).toLocaleString()}`,
      estimatedDuration: duration,
      status: "Pending Analysis",
      notes: undefined,
      createdAt: now,
      updatedAt: now,
    });
    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    id: v.id("cargoQuotes"),
    status: v.optional(v.union(
      v.literal("Pending Analysis"), v.literal("Offered"),
      v.literal("Approved"), v.literal("Rejected")
    )),
    estimatedCost: v.optional(v.string()),
    estimatedDuration: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: new Date().toISOString() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("cargoQuotes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("cargoQuotes").collect();
    return {
      total: all.length,
      pending: all.filter((q) => q.status === "Pending Analysis").length,
      offered: all.filter((q) => q.status === "Offered").length,
      approved: all.filter((q) => q.status === "Approved").length,
      rejected: all.filter((q) => q.status === "Rejected").length,
    };
  },
});
