import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const log = mutation({
  args: {
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    userId: v.optional(v.string()),
    userName: v.optional(v.string()),
    changes: v.optional(v.any()),
    ip: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("auditLog", {
      ...args,
      timestamp: new Date().toISOString(),
    });
  },
});

export const list = query({
  args: {
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.entityType && args.entityId) {
      return await ctx.db
        .query("auditLog")
        .withIndex("by_entity", (ix) =>
          ix.eq("entityType", args.entityType!).eq("entityId", args.entityId!)
        )
        .order("desc")
        .take(args.limit || 100);
    }
    return await ctx.db
      .query("auditLog")
      .order("desc")
      .take(args.limit || 100);
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("auditLog")
      .order("desc")
      .take(args.limit || 50);
  },
});

export const clearOld = mutation({
  args: { olderThanDays: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (args.olderThanDays || 90));
    const old = await ctx.db
      .query("auditLog")
      .filter((q) => q.lt(q.field("timestamp"), cutoff.toISOString()))
      .collect();
    for (const entry of old) {
      await ctx.db.delete(entry._id);
    }
    return { deleted: old.length };
  },
});
