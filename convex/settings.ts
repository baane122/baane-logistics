import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("settings")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("settings").collect();
  },
});

export const set = mutation({
  args: {
    key: v.string(),
    value: v.any(),
    category: v.string(),
    description: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    const now = new Date().toISOString();
    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        category: args.category,
        description: args.description,
        updatedBy: args.updatedBy,
        updatedAt: now,
      });
      return existing._id;
    }
    return await ctx.db.insert("settings", {
      key: args.key,
      value: args.value,
      category: args.category,
      description: args.description,
      updatedBy: args.updatedBy,
      updatedAt: now,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("settings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const seedDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const defaults = [
      { key: "app_name", value: "Baane Logistics", category: "general", description: "Application display name" },
      { key: "app_tagline", value: "China to Somaliland logistics • Unlocked", category: "general" },
      { key: "company_email", value: "info@baanelogistics.com", category: "contact" },
      { key: "company_phone", value: "+252 63 37066667", category: "contact" },
      { key: "hargeisa_office", value: "Suuqa Hadhwanaag Mall, Somaliland", category: "contact" },
      { key: "yiwu_office", value: "义乌市雪峰东路与宾王路交叉口—义陆航集运中心-30号门", category: "contact" },
      { key: "yiwu_phone", value: "+86 15277074143", category: "contact" },
      { key: "whatsapp_number", value: "8615277074143", category: "contact" },
      { key: "default_ai_model", value: "gemini-2.0-flash", category: "ai" },
      { key: "ai_temperature", value: "0.7", category: "ai" },
      { key: "ai_max_tokens", value: "2048", category: "ai" },
      { key: "currency_usd_to_cny", value: "7.25", category: "currency" },
      { key: "currency_usd_to_slsh", value: "8500", category: "currency" },
      { key: "shipping_sea_base_rate", value: "85", category: "shipping", description: "Rate per CBM" },
      { key: "shipping_air_base_rate", value: "4.8", category: "shipping", description: "Rate per kg" },
      { key: "shipping_min_fcl_fee", value: "950", category: "shipping" },
      { key: "insurance_rate", value: "0.015", category: "shipping", description: "Percentage of cargo value" },
    ];
    for (const s of defaults) {
      const existing = await ctx.db.query("settings").withIndex("by_key", (q) => q.eq("key", s.key)).first();
      if (!existing) {
        await ctx.db.insert("settings", { ...s, updatedAt: now });
      }
    }
    return { seeded: defaults.length };
  },
});
