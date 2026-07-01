export interface RouteCheckpoint {
  name: string;
  status: "Completed" | "In Progress" | "Pending";
  date: string;
  coordinates: [number, number]; // [Longitude, Latitude] for map plotting
}

export interface TrackingData {
  id: string;
  type: "Sea Cargo" | "Air Cargo";
  carrier: string;
  vessel: string;
  origin: string;
  destination: string;
  status: string;
  progress: number; // 0 - 100
  metrics: {
    temperature: string;
    humidity: string;
    status: string;
  };
  departureDate: string;
  arrivalDate: string;
  shipper: string;
  consignee: string;
  cargoDetails: string;
  weight: string;
  currentLocation: string;
  route: RouteCheckpoint[];
}

export interface SourcingRequest {
  id: string;
  name: string;
  phone: string;
  productType: string;
  quantity: string;
  budget: string;
  targetMarket: string; // Yiwu, Guangzhou, Shenzhen, Online
  description: string;
  status: "Received" | "Searching Suppliers" | "Verifying Samples" | "Quoted";
  createdAt: string;
}

export interface InspectionRequest {
  id: string;
  name: string;
  phone: string;
  factoryName: string;
  factoryAddress: string;
  city: "Yiwu" | "Guangzhou" | "Shenzhen" | "Ningbo" | "Foshan" | "Other";
  inspectionDate: string;
  scope: "Factory Audit" | "During Production (DUPRO)" | "Pre-Shipment Inspection (PSI)" | "Container Loading Supervision";
  productType: string;
  status: "Pending Schedule" | "Inspector Assigned" | "Inspection In Progress" | "Report Completed";
  createdAt: string;
}

export interface CargoQuote {
  id: string;
  name: string;
  phone: string;
  serviceType: "Sea Cargo" | "Air Cargo";
  cargoType: string; // Electronics, Apparel, Construction, General Cargo
  origin: string; // Shanghai, Yiwu, Guangzhou, Shenzhen, Ningbo
  destination: "Berbera Port" | "Hargeisa Hub" | "Burao Depot" | "Mogadishu";
  weight: string;
  volume: string;
  status: "Pending Analysis" | "Offered" | "Approved";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
