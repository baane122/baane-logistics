import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("aiModels").collect();
  },
});

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("aiModels")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("aiModels") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    provider: v.union(v.literal("google"), v.literal("openai"), v.literal("anthropic"), v.literal("custom")),
    modelId: v.string(),
    apiKey: v.string(),
    baseUrl: v.optional(v.string()),
    isActive: v.boolean(),
    capabilities: v.array(v.string()),
    maxTokens: v.optional(v.number()),
    temperature: v.optional(v.number()),
    costPer1kInput: v.optional(v.number()),
    costPer1kOutput: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("aiModels", { ...args, createdAt: now, updatedAt: now });
  },
});

export const update = mutation({
  args: {
    id: v.id("aiModels"),
    name: v.optional(v.string()),
    provider: v.optional(v.union(v.literal("google"), v.literal("openai"), v.literal("anthropic"), v.literal("custom"))),
    modelId: v.optional(v.string()),
    apiKey: v.optional(v.string()),
    baseUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    capabilities: v.optional(v.array(v.string())),
    maxTokens: v.optional(v.number()),
    temperature: v.optional(v.number()),
    costPer1kInput: v.optional(v.number()),
    costPer1kOutput: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: new Date().toISOString() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("aiModels") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("aiModels") },
  handler: async (ctx, args) => {
    const model = await ctx.db.get(args.id);
    if (!model) throw new Error("Model not found");
    await ctx.db.patch(args.id, { isActive: !model.isActive, updatedAt: new Date().toISOString() });
    return await ctx.db.get(args.id);
  },
});
