import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Seed data for the 3 demo containers
const SEED_CONTAINERS = [
  {
    trackingId: "BAANE-SEA-8821",
    type: "Sea Cargo" as const,
    carrier: "Maersk / Baane Sea Line",
    vessel: "BAANE EMERALD V-402",
    origin: "Shenzhen Port, China",
    destination: "Berbera Port, Somaliland",
    status: "In Transit",
    progress: 72,
    metrics: { temperature: "22.4°C", humidity: "51%", status: "Nominal" },
    departureDate: "2026-06-12",
    arrivalDate: "2026-07-08",
    shipper: "Yiwu Trade Corp Ltd",
    consignee: "Baane Logistics Somaliland",
    cargoDetails: "40ft High-Cube Container (Solar Electronics & Inverters)",
    weight: "22,400 kg",
    currentLocation: "Indian Ocean (Approaching Gulf of Aden)",
    route: [
      { name: "Shenzhen Port (Origin)", status: "Completed" as const, date: "2026-06-12", coordinates: [114.26, 22.48] },
      { name: "South China Sea Transit", status: "Completed" as const, date: "2026-06-15", coordinates: [111.50, 14.30] },
      { name: "Malacca Strait Transit", status: "Completed" as const, date: "2026-06-19", coordinates: [100.20, 4.50] },
      { name: "Indian Ocean Transit", status: "In Progress" as const, date: "2026-06-25", coordinates: [75.00, 5.00] },
      { name: "Gulf of Aden Passage", status: "Pending" as const, date: "2026-07-03", coordinates: [48.00, 12.50] },
      { name: "Berbera Port (Discharge)", status: "Pending" as const, date: "2026-07-08", coordinates: [45.01, 10.43] },
      { name: "Hargeisa Hub (Final)", status: "Pending" as const, date: "2026-07-10", coordinates: [44.06, 9.56] },
    ],
  },
  {
    trackingId: "BAANE-AIR-5042",
    type: "Air Cargo" as const,
    carrier: "Ethiopian Cargo / Baane Express",
    vessel: "BOEING 777-F (ET-802)",
    origin: "Guangzhou Baiyun Airport (CAN)",
    destination: "Hargeisa Egal International Airport (HGA)",
    status: "Delivered",
    progress: 100,
    metrics: { temperature: "19.8°C", humidity: "42%", status: "Delivered" },
    departureDate: "2026-06-28",
    arrivalDate: "2026-06-30",
    shipper: "Shenzhen Precision Electronics",
    consignee: "Somali Global Trading Ltd",
    cargoDetails: "Pallet Cargo (Medical Devices & Smart Accessories)",
    weight: "1,250 kg",
    currentLocation: "Delivered - Hargeisa Warehouse",
    route: [
      { name: "Guangzhou Airport (Origin)", status: "Completed" as const, date: "2026-06-28", coordinates: [113.30, 23.39] },
      { name: "Addis Ababa Hub (Transit)", status: "Completed" as const, date: "2026-06-29", coordinates: [38.79, 8.97] },
      { name: "Hargeisa Airport (Arrival)", status: "Completed" as const, date: "2026-06-30", coordinates: [44.08, 9.51] },
      { name: "Baane Hargeisa WH (Final)", status: "Completed" as const, date: "2026-06-30", coordinates: [44.06, 9.56] },
    ],
  },
  {
    trackingId: "BAANE-SEA-9013",
    type: "Sea Cargo" as const,
    carrier: "COSCO / Baane Partner",
    vessel: "PACIFIC GLORY V-109",
    origin: "Ningbo-Zhoushan Port, China",
    destination: "Berbera Port, Somaliland",
    status: "Origin Customs",
    progress: 18,
    metrics: { temperature: "25.1°C", humidity: "62%", status: "Nominal" },
    departureDate: "2026-06-28",
    arrivalDate: "2026-07-25",
    shipper: "Foshan Ceramics Industry",
    consignee: "Somaliland Building Supplies",
    cargoDetails: "20ft Standard Container (Premium Porcelain Tiles)",
    weight: "18,900 kg",
    currentLocation: "East China Sea",
    route: [
      { name: "Ningbo Port (Origin)", status: "Completed" as const, date: "2026-06-28", coordinates: [121.85, 29.85] },
      { name: "East China Sea Transit", status: "In Progress" as const, date: "2026-06-30", coordinates: [122.50, 25.00] },
      { name: "South China Sea Transit", status: "Pending" as const, date: "2026-07-03", coordinates: [111.50, 14.30] },
      { name: "Malacca Strait Transit", status: "Pending" as const, date: "2026-07-07", coordinates: [100.20, 4.50] },
      { name: "Indian Ocean Transit", status: "Pending" as const, date: "2026-07-13", coordinates: [75.00, 5.00] },
      { name: "Berbera Port (Discharge)", status: "Pending" as const, date: "2026-07-25", coordinates: [45.01, 10.43] },
    ],
  },
];

export const seedContainers = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("containers").first();
    if (existing) return { seeded: false, reason: "Already seeded" };

    const now = new Date().toISOString();
    for (const container of SEED_CONTAINERS) {
      await ctx.db.insert("containers", {
        ...container,
        createdAt: now,
        updatedAt: now,
      });
    }
    return { seeded: true, count: SEED_CONTAINERS.length };
  },
});

export const getByTrackingId = query({
  args: { trackingId: v.string() },
  handler: async (ctx, args) => {
    const container = await ctx.db
      .query("containers")
      .withIndex("by_trackingId", (q) => q.eq("trackingId", args.trackingId.toUpperCase()))
      .first();
    return container || null;
  },
});

export const list = query({
  args: {
    status: v.optional(v.string()),
    type: v.optional(v.union(v.literal("Sea Cargo"), v.literal("Air Cargo"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("containers")
        .withIndex("by_status", (ix) => ix.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 50);
    }
    if (args.type) {
      return await ctx.db
        .query("containers")
        .withIndex("by_type", (ix) => ix.eq("type", args.type!))
        .order("desc")
        .take(args.limit || 50);
    }
    return await ctx.db
      .query("containers")
      .order("desc")
      .take(args.limit || 50);
  },
});

export const create = mutation({
  args: {
    trackingId: v.string(),
    type: v.union(v.literal("Sea Cargo"), v.literal("Air Cargo")),
    carrier: v.string(),
    vessel: v.string(),
    origin: v.string(),
    destination: v.string(),
    status: v.string(),
    progress: v.number(),
    metrics: v.object({
      temperature: v.string(),
      humidity: v.string(),
      status: v.string(),
    }),
    departureDate: v.string(),
    arrivalDate: v.string(),
    shipper: v.string(),
    consignee: v.string(),
    cargoDetails: v.string(),
    weight: v.string(),
    currentLocation: v.string(),
    route: v.array(
      v.object({
        name: v.string(),
        status: v.union(v.literal("Completed"), v.literal("In Progress"), v.literal("Pending")),
        date: v.string(),
        coordinates: v.array(v.float64()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("containers", { ...args, createdAt: now, updatedAt: now });
  },
});

export const update = mutation({
  args: {
    id: v.id("containers"),
    trackingId: v.optional(v.string()),
    status: v.optional(v.string()),
    progress: v.optional(v.number()),
    currentLocation: v.optional(v.string()),
    metrics: v.optional(v.object({
      temperature: v.string(),
      humidity: v.string(),
      status: v.string(),
    })),
    route: v.optional(v.array(
      v.object({
        name: v.string(),
        status: v.union(v.literal("Completed"), v.literal("In Progress"), v.literal("Pending")),
        date: v.string(),
        coordinates: v.array(v.float64()),
      })
    )),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: new Date().toISOString() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("containers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("containers").collect();
    return {
      total: all.length,
      inTransit: all.filter((c) => c.status === "In Transit").length,
      delivered: all.filter((c) => c.status === "Delivered").length,
      pending: all.filter((c) => c.status === "Origin Customs" || c.status === "Pending").length,
      sea: all.filter((c) => c.type === "Sea Cargo").length,
      air: all.filter((c) => c.type === "Air Cargo").length,
    };
  },
});
