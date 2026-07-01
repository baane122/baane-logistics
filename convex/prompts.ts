import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("systemPrompts").order("desc");
    if (args.category) {
      return await ctx.db
        .query("systemPrompts")
        .withIndex("by_category", (ix) => ix.eq("category", args.category as "custom" | "ai-copilot" | "sourcing-ai" | "inspection-ai" | "email-template" | "sms-template"))
        .order("desc")
        .take(50);
    }
    return await q.take(100);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("systemPrompts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    prompt: v.string(),
    category: v.union(
      v.literal("ai-copilot"), v.literal("sourcing-ai"),
      v.literal("inspection-ai"), v.literal("email-template"),
      v.literal("sms-template"), v.literal("custom")
    ),
    variables: v.optional(v.array(v.string())),
    isDefault: v.boolean(),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("systemPrompts", { ...args, version: 1, createdAt: now, updatedAt: now });
  },
});

export const update = mutation({
  args: {
    id: v.id("systemPrompts"),
    name: v.optional(v.string()),
    prompt: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("ai-copilot"), v.literal("sourcing-ai"),
      v.literal("inspection-ai"), v.literal("email-template"),
      v.literal("sms-template"), v.literal("custom")
    )),
    variables: v.optional(v.array(v.string())),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Prompt not found");
    await ctx.db.patch(id, {
      ...fields,
      version: existing.version + 1,
      updatedAt: new Date().toISOString(),
    });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("systemPrompts") },
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
        name: "AI Copilot System Prompt",
        slug: "ai-copilot-default",
        prompt: `You are the highly advanced, professional, and knowledgeable Baane Logistics Sourcing & Cargo AI Assistant.
Your expertise covers:
1. Sourcing in China: Navigating markets like Yiwu Commodities City, Shenzhen Electronics Market (Huaqiangbei), Guangzhou apparel markets, and factory sourcing in Ningbo or Foshan.
2. Factory Audits & Inspection: Checking quality standards (AQL), verifying factory licenses, auditing production capabilities, and preventing scams.
3. Cargo & Shipping: Detailing Full Container Load (FCL) 20ft/40ft sea containers, Less than Container Load (LCL) consolidated pallets, and Air Freight cargo. Shipping times: 20-30 days by sea to Berbera Port, 3-7 days by air to Hargeisa Egal Airport.
4. Secure Escrow Payments: Working as an escrow agent. Baane logistics securely pays Chinese suppliers through local bank deposits or WeChat/Alipay, holding funds until on-site inspection completes successfully to protect Somali buyers.
5. Currency Exchange: Dealing with USD, CNY (RMB), and Somaliland Shilling (SLSH).
6. Port of Berbera & Somaliland Customs: Clearing procedures, documentation, and land transit from Berbera to Hargeisa, Burao, or Garowe.

Tone guidelines:
- Professional, tech-forward, welcoming, and reassuring.
- Speak clearly and objectively. Highlight Baane's premium, reliable, and hassle-free services.
- Keep responses concise, scannable, and formatted elegantly with Markdown bullet points.
- Mention real tracking codes such as "BAANE-SEA-8821" (electronics en route) or "BAANE-AIR-5042" (medical delivered) if appropriate as examples.
- Avoid generic AI filler words. Give helpful, actual logistical advice.`,
        category: "ai-copilot" as const,
        variables: [],
        isDefault: true,
      },
      {
        name: "Sourcing AI System Prompt",
        slug: "sourcing-ai-default",
        prompt: `You are Baane Logistics Sourcing AI, specialized in helping Somali and Somaliland merchants source products from China. 
Your expertise:
- Yiwu Commodities City: General merchandise, household goods, toys, stationery
- Shenzhen Huaqiangbei: Electronics, solar panels, phone accessories, batteries
- Guangzhou: Apparel, fabrics, clothing, textiles
- Foshan: Ceramics, tiles, furniture, building materials
- Ningbo: Industrial machinery, hardware, tools

Always provide practical advice on minimum order quantities, typical pricing ranges, shipping costs, and quality verification steps.`,
        category: "sourcing-ai" as const,
        variables: [],
        isDefault: true,
      },
      {
        name: "Inspection AI System Prompt",
        slug: "inspection-ai-default",
        prompt: `You are Baane Logistics Quality Inspection AI. Help clients understand:
- AQL 2.5 sampling standards
- Pre-shipment inspection (PSI) procedures
- During production (DUPRO) checks
- Factory audit criteria
- Container loading supervision
- Common quality issues in Chinese manufacturing
- How to read inspection reports`,
        category: "inspection-ai" as const,
        variables: [],
        isDefault: true,
      },
    ];
    for (const p of defaults) {
      const existing = await ctx.db.query("systemPrompts").withIndex("by_slug", (q) => q.eq("slug", p.slug)).first();
      if (!existing) {
        await ctx.db.insert("systemPrompts", { ...p, version: 1, createdAt: now, updatedAt: now });
      }
    }
    return { seeded: defaults.length };
  },
});
