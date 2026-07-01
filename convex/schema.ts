import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- Users & Auth ---
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff"), v.literal("viewer")),
    isActive: v.boolean(),
    lastLogin: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // --- Settings (key-value store) ---
  settings: defineTable({
    key: v.string(),
    value: v.any(),
    category: v.string(),
    description: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
    updatedAt: v.string(),
  })
    .index("by_key", ["key"])
    .index("by_category", ["category"]),

  // --- AI Models Configuration ---
  aiModels: defineTable({
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
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_provider", ["provider"])
    .index("by_active", ["isActive"]),

  // --- System Prompts ---
  systemPrompts: defineTable({
    name: v.string(),
    slug: v.string(),
    prompt: v.string(),
    category: v.union(
      v.literal("ai-copilot"),
      v.literal("sourcing-ai"),
      v.literal("inspection-ai"),
      v.literal("email-template"),
      v.literal("sms-template"),
      v.literal("custom")
    ),
    variables: v.optional(v.array(v.string())),
    isDefault: v.boolean(),
    version: v.number(),
    createdBy: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"]),

  // --- API Keys (for external integrations) ---
  apiKeys: defineTable({
    name: v.string(),
    key: v.string(),
    provider: v.string(),
    scopes: v.array(v.string()),
    isActive: v.boolean(),
    lastUsed: v.optional(v.string()),
    expiresAt: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_provider", ["provider"])
    .index("by_active", ["isActive"]),

  // --- Email Templates ---
  emailTemplates: defineTable({
    name: v.string(),
    slug: v.string(),
    subject: v.string(),
    body: v.string(),
    category: v.string(),
    variables: v.optional(v.array(v.string())),
    isDefault: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_slug", ["slug"]),

  // --- Tracking / Containers ---
  containers: defineTable({
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
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_trackingId", ["trackingId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  // --- Sourcing Requests ---
  sourcingRequests: defineTable({
    name: v.string(),
    phone: v.string(),
    productType: v.string(),
    quantity: v.string(),
    budget: v.optional(v.string()),
    targetMarket: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("Received"), v.literal("Searching Suppliers"),
      v.literal("Verifying Samples"), v.literal("Quoted"),
      v.literal("Completed"), v.literal("Cancelled")
    ),
    notes: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    quotationAmount: v.optional(v.string()),
    supplierFound: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // --- Inspection Requests ---
  inspectionRequests: defineTable({
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
    status: v.union(
      v.literal("Pending Schedule"), v.literal("Inspector Assigned"),
      v.literal("Inspection In Progress"), v.literal("Report Completed"),
      v.literal("Cancelled")
    ),
    inspectorName: v.optional(v.string()),
    reportUrl: v.optional(v.string()),
    reportData: v.optional(v.any()),
    photos: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_city", ["city"])
    .index("by_createdAt", ["createdAt"]),

  // --- Cargo Quotes ---
  cargoQuotes: defineTable({
    name: v.string(),
    phone: v.string(),
    serviceType: v.union(v.literal("Sea Cargo"), v.literal("Air Cargo")),
    cargoType: v.string(),
    origin: v.string(),
    destination: v.union(
      v.literal("Berbera Port"), v.literal("Hargeisa Hub"),
      v.literal("Burao Depot"), v.literal("Mogadishu")
    ),
    weight: v.string(),
    volume: v.string(),
    estimatedCost: v.optional(v.string()),
    estimatedDuration: v.optional(v.string()),
    breakdown: v.optional(v.object({
      freight: v.string(),
      insurance: v.string(),
      customs: v.string(),
      handling: v.string(),
      total: v.string(),
    })),
    status: v.union(
      v.literal("Pending Analysis"), v.literal("Offered"),
      v.literal("Approved"), v.literal("Rejected")
    ),
    notes: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // --- Chat Messages ---
  chatMessages: defineTable({
    sessionId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.string(),
  })
    .index("by_session", ["sessionId", "timestamp"]),

  // --- Audit Log ---
  auditLog: defineTable({
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    userId: v.optional(v.string()),
    userName: v.optional(v.string()),
    changes: v.optional(v.any()),
    ip: v.optional(v.string()),
    timestamp: v.string(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_entity", ["entityType", "entityId"]),
});
