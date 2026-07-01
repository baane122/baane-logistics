import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const router = httpRouter();

// Health check
router.route({
  path: "/api/health",
  method: "GET",
  handler: httpAction(async (_ctx, _req) => {
    return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Legacy tracking endpoint (for backward compatibility with existing frontend)
router.route({
  path: "/api/tracking/:id",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    // Extract ID from the URL path - handle both /api/tracking/ID and /api/tracking%2F:ID
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const id = pathParts[pathParts.length - 1] || "";
    const result = await ctx.runQuery(api.containers.getByTrackingId, { trackingId: id });
    if (result) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Dynamic fallback
    const upperId = id.toUpperCase();
    const isAir = upperId.includes("AIR");
    const randomProgress = Math.floor(Math.random() * 80) + 10;
    return new Response(JSON.stringify({
      id: upperId,
      type: isAir ? "Air Cargo" : "Sea Cargo",
      carrier: "Baane Logistics Global Line",
      vessel: isAir ? "BAANE SKYLINER B-747" : "BAANE OCEAN SPIRIT S-55",
      origin: isAir ? "Yiwu Cargo Airport" : "Shanghai Port, China",
      destination: isAir ? "Hargeisa Egal Airport" : "Berbera Port, Somaliland",
      status: "Processing Transit",
      progress: randomProgress,
      metrics: { temperature: "21.5°C", humidity: "48%", status: "Optimized" },
      departureDate: "2026-06-20",
      arrivalDate: "2026-07-15",
      shipper: "Sourcing Partner (China)",
      consignee: "Baane Client (Somaliland)",
      cargoDetails: "Commercial Import Goods - Quality Assured",
      weight: "4,500 kg",
      currentLocation: isAir ? "En Route (Air)" : "En Route (Maritime Transit)",
      route: [
        { name: isAir ? "Yiwu Airport (Origin)" : "Shanghai Port (Origin)", status: "Completed", date: "2026-06-20", coordinates: [121.47, 31.23] },
        { name: isAir ? "Intermediate Hub" : "Indian Ocean Passage", status: randomProgress > 50 ? "Completed" : "In Progress", date: "2026-06-25", coordinates: [80.00, 6.00] },
        { name: "Berbera / Air Terminal", status: "Pending", date: "2026-07-15", coordinates: [45.01, 10.43] },
      ],
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Legacy sourcing endpoint
router.route({
  path: "/api/sourcing",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    const result = await ctx.runMutation(api.sourcing.create, {
      name: body.name || "",
      phone: body.phone || "",
      productType: body.productType || "",
      quantity: body.quantity || "",
      budget: body.budget || undefined,
      targetMarket: body.targetMarket || "Yiwu Commodities City",
      description: body.description || undefined,
    });
    return new Response(JSON.stringify({ success: true, request: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Legacy inspection endpoint
router.route({
  path: "/api/inspection",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    const result = await ctx.runMutation(api.inspections.create, {
      name: body.name || "",
      phone: body.phone || "",
      factoryName: body.factoryName || "",
      factoryAddress: body.factoryAddress || "",
      city: body.city || "Yiwu",
      inspectionDate: body.inspectionDate || "",
      scope: body.scope || "Pre-Shipment Inspection (PSI)",
      productType: body.productType || "",
    });
    return new Response(JSON.stringify({ success: true, request: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Legacy quotes endpoint
router.route({
  path: "/api/quotes",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    const result = await ctx.runMutation(api.quotes.create, {
      name: body.name || "",
      phone: body.phone || "",
      serviceType: body.serviceType || "Sea Cargo",
      cargoType: body.cargoType || "General Cargo",
      origin: body.origin || "Shanghai",
      destination: body.destination || "Berbera Port",
      weight: body.weight || "0",
      volume: body.volume || "0",
    });
    return new Response(JSON.stringify({ success: true, request: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Legacy chat endpoint
router.route({
  path: "/api/chat",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    const message = body.message || "";
    const { getFallbackResponse } = await import("./chat");
    const text = getFallbackResponse(message);
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// SPA catch-all - serve index.html for non-API routes (for Vercel/static hosting)
router.route({
  path: "/",
  method: "GET",
  handler: httpAction(async (_ctx, req) => {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    // For SPA routing, this just confirms the API is live
    return new Response(JSON.stringify({ status: "ok", message: "Baane Logistics API" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default router;
