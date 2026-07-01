import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
// Convex Cloud URL for client
process.env.VITE_CONVEX_URL = process.env.VITE_CONVEX_URL || "https://tangible-husky-835.eu-west-1.convex.cloud";

// Resolve __dirname since we are in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

// Validate API key early
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
if (!GEMINI_API_KEY) {
  console.warn("⚠️  GEMINI_API_KEY not set. AI Copilot will use fallback offline mode.");
}

// Initialize Gemini SDK with recommended configurations
let ai: GoogleGenAI | null = null;
if (GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback offline AI responses when no GEMINI_API_KEY is configured
function fallbackChatResponse(userMessage: string): string {
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

// Mock Tracking Data with highly detailed paths (China to Somaliland)
const trackingData: Record<string, any> = {
  "BAANE-SEA-8821": {
    id: "BAANE-SEA-8821",
    type: "Sea Cargo",
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
      { name: "Shenzhen Port (Origin)", status: "Completed", date: "2026-06-12", coordinates: [114.26, 22.48] },
      { name: "South China Sea Transit", status: "Completed", date: "2026-06-15", coordinates: [111.50, 14.30] },
      { name: "Malacca Strait Transit", status: "Completed", date: "2026-06-19", coordinates: [100.20, 4.50] },
      { name: "Indian Ocean Transit", status: "In Progress", date: "2026-06-25", coordinates: [75.00, 5.00] },
      { name: "Gulf of Aden Passage", status: "Pending", date: "2026-07-03", coordinates: [48.00, 12.50] },
      { name: "Berbera Port (Discharge)", status: "Pending", date: "2026-07-08", coordinates: [45.01, 10.43] },
      { name: "Hargeisa Hub (Final)", status: "Pending", date: "2026-07-10", coordinates: [44.06, 9.56] },
    ],
  },
  "BAANE-AIR-5042": {
    id: "BAANE-AIR-5042",
    type: "Air Cargo",
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
      { name: "Guangzhou Airport (Origin)", status: "Completed", date: "2026-06-28", coordinates: [113.30, 23.39] },
      { name: "Addis Ababa Hub (Transit)", status: "Completed", date: "2026-06-29", coordinates: [38.79, 8.97] },
      { name: "Hargeisa Airport (Arrival)", status: "Completed", date: "2026-06-30", coordinates: [44.08, 9.51] },
      { name: "Baane Hargeisa WH (Final)", status: "Completed", date: "2026-06-30", coordinates: [44.06, 9.56] },
    ],
  },
  "BAANE-SEA-9013": {
    id: "BAANE-SEA-9013",
    type: "Sea Cargo",
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
      { name: "Ningbo Port (Origin)", status: "Completed", date: "2026-06-28", coordinates: [121.85, 29.85] },
      { name: "East China Sea Transit", status: "In Progress", date: "2026-06-30", coordinates: [122.50, 25.00] },
      { name: "South China Sea Transit", status: "Pending", date: "2026-07-03", coordinates: [111.50, 14.30] },
      { name: "Malacca Strait Transit", status: "Pending", date: "2026-07-07", coordinates: [100.20, 4.50] },
      { name: "Indian Ocean Transit", status: "Pending", date: "2026-07-13", coordinates: [75.00, 5.00] },
      { name: "Berbera Port (Discharge)", status: "Pending", date: "2026-07-25", coordinates: [45.01, 10.43] },
    ],
  },
};

// In-Memory Storage for Requests
const sourcingRequests: any[] = [];
const inspectionRequests: any[] = [];
const cargoQuotes: any[] = [];

// API: Tracking Endpoint
app.get("/api/tracking/:id", (req, res) => {
  const { id } = req.params;
  const upperId = id.toUpperCase().trim();
  
  if (trackingData[upperId]) {
    return res.json(trackingData[upperId]);
  }
  
  // Dynamic fallback for any other tracking code
  const isAir = upperId.includes("AIR");
  const randomProgress = Math.floor(Math.random() * 80) + 10;
  const dateStr = new Date().toISOString().split('T')[0];
  
  const dynamicRoute = [
    { name: isAir ? "Yiwu Airport (Origin)" : "Shanghai Port (Origin)", status: "Completed", date: "2026-06-20", coordinates: [121.47, 31.23] },
    { name: isAir ? "Intermediate Hub" : "Indian Ocean Passage", status: randomProgress > 50 ? "Completed" : "In Progress", date: "2026-06-25", coordinates: [80.00, 6.00] },
    { name: "Berbera / Air Terminal", status: "Pending", date: "2026-07-15", coordinates: [45.01, 10.43] },
  ];

  return res.json({
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
    route: dynamicRoute,
  });
});

// API: Save Sourcing Request
app.post("/api/sourcing", (req, res) => {
  const request = {
    id: "SRC-" + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  sourcingRequests.push(request);
  res.json({ success: true, request });
});

// API: Save Inspection Booking
app.post("/api/inspection", (req, res) => {
  const request = {
    id: "INSP-" + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  inspectionRequests.push(request);
  res.json({ success: true, request });
});

// API: Save Cargo Quote
app.post("/api/quotes", (req, res) => {
  const request = {
    id: "QT-" + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  cargoQuotes.push(request);
  res.json({ success: true, request });
});

// API: Chat Endpoint Proxy for Gemini API
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const systemInstruction = `You are the highly advanced, professional, and knowledgeable Baane Logistics Sourcing & Cargo AI Assistant.
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
- Keep responses concise, scannable, and formatted elegantly with Markdown bullet points. Use appropriate formatting.
- Mention real tracking codes such as "BAANE-SEA-8821" (electronics en route) or "BAANE-AIR-5042" (medical delivered) if appropriate as examples.

Avoid generic AI filler words. Give helpful, actual logistical advice, shipping routes, custom fees guidelines, and market suggestions in China.`;

    // Map conversation history to the correct Gemini SDK format
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Create chat session with gemini-3.5-flash
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: formattedHistory,
    });

    const result = await chat.sendMessage({ message });
    res.json({ text: result.text });
  } catch (err: any) {
    console.error("Gemini API Error in backend:", err);
    // On API failure, use fallback response instead of showing error
    const fallbackText = fallbackChatResponse(message);
    res.status(200).json({
      text: fallbackText,
      _fallback: true,
    });
  }
});

// Startup function
async function startServer() {
  // Vite Middleware for development, static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { maxAge: "1y", immutable: true }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🌍 Baane Logistics Server running on http://localhost:${PORT}`);
    console.log(`📋 Tracking Demo: http://localhost:${PORT}/api/tracking/BAANE-SEA-8821`);
    if (!GEMINI_API_KEY) {
      console.log("🤖 AI Copilot: OFFLINE (set GEMINI_API_KEY in .env to enable Gemini)");
    } else {
      console.log("🤖 AI Copilot: ONLINE (Gemini 2.0 Flash)");
    }
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
