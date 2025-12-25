// Centralized category normalization for UI

export const CATEGORIES = ["Hardware", "Electrical", "Plumbing"];

const LEGACY_TO_NEW = {
  Smartphones: "Electrical",
  Smartphone: "Electrical",
  Mobiles: "Electrical",
  Mobile: "Electrical",
  Laptops: "Electrical",
  Laptop: "Electrical",
  Headphones: "Electrical",
  Tablets: "Electrical",
  TV: "Electrical",
  TVs: "Electrical",
  Television: "Electrical",
  Cameras: "Electrical",
  Camera: "Electrical",
  Gaming: "Electrical",
  Electronics: "Electrical"
};

export function normalizeCategory(name) {
  if (!name) return "";
  const key = String(name).trim();
  return LEGACY_TO_NEW[key] || key;
}
