import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(v.union(
      v.literal("Pending Schedule"), v.literal("Inspector Assigned"),
      v.literal("Inspection In Progress"), v.literal("Report Completed"), v.literal("Cancelled")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("inspectionRequests")
        .withIndex("by_status", (ix) => ix.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 100);
    }
    return await ctx.db
      .query("inspectionRequests")
      .order("desc")
      .take(args.limit || 100);
  },
});

export const getById = query({
  args: { id: v.id("inspectionRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    factoryName: v.string(),
    factoryAddress: v.string(),
    city: v.union(
      v.literal("Yiwu"), v.literal("Guangzhou"), v.literal("Shenzhen"),
      v.literal("Ningbo"), v.literal("Foshan"), v.literal("Other")
    ),
    inspectionDate: v.string(),
    scope: v.union(
      v.literal("Factory Audit"),
      v.literal("During Production (DUPRO)"),
      v.literal("Pre-Shipment Inspection (PSI)"),
      v.literal("Container Loading Supervision")
    ),
    productType: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const id = await ctx.db.insert("inspectionRequests", {
      ...args,
      status: "Pending Schedule",
      inspectorName: undefined,
      reportUrl: undefined,
      notes: undefined,
      createdAt: now,
      updatedAt: now,
    });
    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    id: v.id("inspectionRequests"),
    status: v.optional(v.union(
      v.literal("Pending Schedule"), v.literal("Inspector Assigned"),
      v.literal("Inspection In Progress"), v.literal("Report Completed"), v.literal("Cancelled")
    )),
    inspectorName: v.optional(v.string()),
    reportUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    inspectionDate: v.optional(v.string()),
    scope: v.optional(v.union(
      v.literal("Factory Audit"),
      v.literal("During Production (DUPRO)"),
      v.literal("Pre-Shipment Inspection (PSI)"),
      v.literal("Container Loading Supervision")
    )),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: new Date().toISOString() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("inspectionRequests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("inspectionRequests").collect();
    return {
      total: all.length,
      pending: all.filter((i) => i.status === "Pending Schedule").length,
      assigned: all.filter((i) => i.status === "Inspector Assigned").length,
      inProgress: all.filter((i) => i.status === "Inspection In Progress").length,
      completed: all.filter((i) => i.status === "Report Completed").length,
    };
  },
});
