import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listBySession = query({
  args: { sessionId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(args.limit || 50);
  },
});

export const sendMessage = mutation({
  args: {
    sessionId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = new Date().toISOString();
    const id = await ctx.db.insert("chatMessages", {
      sessionId: args.sessionId,
      role: args.role,
      content: args.content,
      timestamp,
    });
    return await ctx.db.get(id);
  },
});

// Fallback AI responses when no Gemini key is configured
export function getFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("escrow") || lower.includes("payment")) {
    return "**Baane Secure Escrow Process**:\n\n1. **Deposit USD** in Hargeisa (cash, check, or wire) to our Baane treasury.\n2. **Quality Inspection** — while funds are locked in escrow, our Chinese engineers audit the factory goods.\n3. **Release & CNY Conversion** — once QC is approved, we pay the supplier in CNY directly.\n\nThis eliminates the risk of paying Chinese suppliers upfront without verifying quality.";
  }
  if (lower.includes("yiwu") || lower.includes("sourcing") || lower.includes("supplier")) {
    return "**Sourcing from China**:\n\nOur on-ground teams operate in:\n- **Yiwu Commodities City** — General merchandise, toys, household goods\n- **Shenzhen (Huaqiangbei)** — Electronics, solar panels, batteries\n- **Guangzhou** — Apparel, fabrics, and textiles\n- **Foshan** — Ceramics, tiles, furniture\n\nWe do factory audits, sample verification, and negotiate wholesale pricing.";
  }
  if (lower.includes("berbera") || lower.includes("customs") || lower.includes("clearing")) {
    return "**Berbera Port Clearance**:\n\n- Sea cargo takes **20–30 days** from China to Berbera Port.\n- Baane handles all documentation: Bill of Lading, packing list, certificate of origin.\n- Customs clearing at Berbera typically takes **2–4 business days**.\n- Last-mile delivery to Hargeisa, Burao, or Garowe arranged upon clearance.";
  }
  if (lower.includes("air") || lower.includes("express") || lower.includes("flight")) {
    return "**Air Cargo to Somaliland**:\n\n- **3–7 days** from China (Yiwu/Guangzhou) to Hargeisa Egal Airport.\n- Best for high-value, low-volume goods like electronics and medical devices.\n- Baane offers Door-to-Airport and Door-to-Door options.\n- Example: BAANE-AIR-5042 (medical devices delivered in 3 days).";
  }
  return "Thank you for contacting **Baane Logistics AI Advisor**. I can help you with:\n\n- 🔍 **Sourcing products** from China (Yiwu, Shenzhen, Guangzhou)\n- 🛡️ **Quality inspections & factory audits**\n- 💰 **Secure escrow payments** (USD → CNY)\n- 🚢 **Sea freight** (20–30 days to Berbera)\n- ✈️ **Air freight** (3–7 days to Hargeisa)\n\nCould you please be more specific about what you'd like to import or which service you need help with?";
}
