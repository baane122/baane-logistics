import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("emailTemplates").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailTemplates")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    subject: v.string(),
    body: v.string(),
    category: v.string(),
    variables: v.optional(v.array(v.string())),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("emailTemplates", { ...args, createdAt: now, updatedAt: now });
  },
});

export const update = mutation({
  args: {
    id: v.id("emailTemplates"),
    name: v.optional(v.string()),
    subject: v.optional(v.string()),
    body: v.optional(v.string()),
    category: v.optional(v.string()),
    variables: v.optional(v.array(v.string())),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: new Date().toISOString() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("emailTemplates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const seedDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const defaults = [
      {
        name: "New Sourcing Request",
        slug: "sourcing-request-confirmation",
        subject: "Baane Logistics - Sourcing Request {{id}} Received",
        body: `Dear {{name}},\n\nThank you for your sourcing request (ID: {{id}}).\n\nProduct: {{productType}}\nQuantity: {{quantity}}\nTarget Market: {{targetMarket}}\n\nOur team in China will begin searching for qualified suppliers within 24 hours.\n\nBest regards,\nBaane Logistics Team`,
        category: "sourcing",
        variables: ["name", "id", "productType", "quantity", "targetMarket"],
        isDefault: true,
      },
      {
        name: "Inspection Scheduled",
        slug: "inspection-scheduled",
        subject: "Baane Logistics - Inspection Scheduled {{id}}",
        body: `Dear {{name}},\n\nYour quality inspection has been scheduled.\n\nInspection ID: {{id}}\nFactory: {{factoryName}}\nDate: {{inspectionDate}}\nScope: {{scope}}\n\nAn inspector will be assigned shortly.\n\nBest regards,\nBaane Logistics Team`,
        category: "inspection",
        variables: ["name", "id", "factoryName", "inspectionDate", "scope"],
        isDefault: true,
      },
    ];
    for (const t of defaults) {
      const existing = await ctx.db.query("emailTemplates").withIndex("by_slug", (q) => q.eq("slug", t.slug)).first();
      if (!existing) {
        await ctx.db.insert("emailTemplates", { ...t, createdAt: now, updatedAt: now });
      }
    }
    return { seeded: defaults.length };
  },
});
