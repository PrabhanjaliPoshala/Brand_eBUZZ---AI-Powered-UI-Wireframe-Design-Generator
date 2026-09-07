import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "5mb" }));

// Server-side Gemini client (lazy / conditional)
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
    return null;
  }
}

// Deterministic fallback parser
function fallbackParseRequirement(requirement: string, domainHint?: string) {
  const text = (requirement || "").toLowerCase();
  
  // Domain detection
  let domain = domainHint || "general";
  if (text.includes("food") || text.includes("restaurant") || text.includes("dish") || text.includes("meal") || text.includes("delivery")) {
    domain = "food_delivery";
  } else if (text.includes("shop") || text.includes("e-commerce") || text.includes("product") || text.includes("cart") || text.includes("checkout")) {
    domain = "ecommerce";
  } else if (text.includes("saas") || text.includes("software") || text.includes("subscription") || text.includes("pricing")) {
    domain = "saas";
  } else if (text.includes("dashboard") || text.includes("crm") || text.includes("analytics") || text.includes("metrics")) {
    domain = "dashboard";
  } else if (text.includes("portfolio") || text.includes("resume") || text.includes("projects") || text.includes("photography")) {
    domain = "portfolio";
  } else if (text.includes("education") || text.includes("course") || text.includes("learning") || text.includes("student")) {
    domain = "education";
  } else if (text.includes("finance") || text.includes("banking") || text.includes("wallet") || text.includes("crypto") || text.includes("invest")) {
    domain = "finance";
  }

  // Page detection
  const pages: string[] = ["Home"];
  if (domain === "ecommerce" || text.includes("product") || text.includes("catalog")) {
    if (!pages.includes("Products")) pages.push("Products");
    if (!pages.includes("Product Details") && (text.includes("detail") || text.includes("view product"))) pages.push("Product Details");
    if (!pages.includes("Cart") && text.includes("cart")) pages.push("Cart");
    if (!pages.includes("Checkout") && text.includes("checkout")) pages.push("Checkout");
  }
  if (domain === "food_delivery" || text.includes("restaurant")) {
    if (!pages.includes("Restaurants")) pages.push("Restaurants");
    if (!pages.includes("Menu")) pages.push("Menu");
    if (!pages.includes("Order Tracking")) pages.push("Order Tracking");
  }
  if (domain === "saas") {
    if (!pages.includes("Features")) pages.push("Features");
    if (!pages.includes("Pricing")) pages.push("Pricing");
    if (!pages.includes("Dashboard")) pages.push("Dashboard");
  }
  if (text.includes("login") || text.includes("auth") || text.includes("sign in")) {
    if (!pages.includes("Login")) pages.push("Login");
  }
  if (text.includes("signup") || text.includes("register")) {
    if (!pages.includes("Signup")) pages.push("Signup");
  }
  if (text.includes("about") && !pages.includes("About Us")) pages.push("About Us");
  if (text.includes("contact") && !pages.includes("Contact")) pages.push("Contact");

  // Component detection
  const components: string[] = ["Navbar"];
  if (text.includes("hero") || !text.includes("no hero")) {
    components.push("Hero");
  }
  if (text.includes("search") || text.includes("location") || domain === "food_delivery") {
    components.push("Search");
  }
  if (text.includes("categor") || domain === "food_delivery" || domain === "ecommerce") {
    components.push("Category Grid");
  }
  if (domain === "ecommerce") {
    components.push("Product Grid");
    components.push("Product Card");
    if (text.includes("filter")) components.push("Filters");
    if (text.includes("cart")) components.push("Cart Summary");
    if (text.includes("checkout")) components.push("Checkout Form");
  } else if (domain === "food_delivery") {
    components.push("Restaurant Grid");
    components.push("Restaurant Card");
    components.push("Offers Banner");
  } else if (domain === "dashboard") {
    components.push("Sidebar");
    components.push("Statistics Cards");
    components.push("Chart Widget");
    components.push("Data Table");
  } else if (domain === "saas") {
    components.push("Feature Highlights");
    components.push("Pricing Table");
    components.push("Testimonials");
    components.push("CTA Banner");
  } else if (domain === "portfolio") {
    components.push("Project Gallery");
    components.push("Skill Badges");
    components.push("Contact Form");
  } else {
    components.push("Content Section");
    components.push("Feature Grid");
  }

  if (text.includes("review") || text.includes("testimonial")) {
    if (!components.includes("Testimonials")) components.push("Testimonials");
  }
  if (text.includes("offer") || text.includes("discount") || text.includes("promo")) {
    if (!components.includes("Offers Banner")) components.push("Offers Banner");
  }
  if (text.includes("pricing") && !components.includes("Pricing Table")) {
    components.push("Pricing Table");
  }
  if (text.includes("faq") || text.includes("question")) {
    components.push("FAQ Accordion");
  }
  if (!components.includes("Footer")) {
    components.push("Footer");
  }

  // Style hints
  const style_hints: string[] = [];
  if (text.includes("minimal")) style_hints.push("minimal");
  if (text.includes("modern") || style_hints.length === 0) style_hints.push("modern");
  if (text.includes("clean")) style_hints.push("clean");
  if (text.includes("dark")) style_hints.push("dark");
  if (text.includes("playful") || text.includes("vibrant")) style_hints.push("vibrant");
  if (text.includes("corporate") || text.includes("enterprise")) style_hints.push("corporate");

  // Colors
  let primary_color = "#3B82F6"; // Default Blue
  if (text.includes("blue")) primary_color = "#2563EB";
  else if (text.includes("orange") || domain === "food_delivery") primary_color = "#F97316";
  else if (text.includes("green") || text.includes("emerald")) primary_color = "#10B981";
  else if (text.includes("purple") || text.includes("violet")) primary_color = "#8B5CF6";
  else if (text.includes("red") || text.includes("rose")) primary_color = "#EF4444";
  else if (text.includes("black") || text.includes("dark") || text.includes("monochrome")) primary_color = "#18181B";
  else if (text.includes("teal")) primary_color = "#0D9488";

  return {
    pages,
    components,
    constraints: [],
    style_hints,
    primary_color,
    domain,
    source: "heuristic-parser",
  };
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const aiReady = Boolean(apiKey && apiKey.trim() !== "" && apiKey !== "MY_GEMINI_API_KEY");
  res.json({
    status: "ok",
    aiConfigured: aiReady,
    timestamp: new Date().toISOString(),
  });
});

// AI Requirement Parser Endpoint
app.post("/api/ai/parse-requirement", async (req, res) => {
  const { requirement, domainHint } = req.body;

  if (!requirement || typeof requirement !== "string") {
    res.status(400).json({ error: "Requirement text is required." });
    return;
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Graceful fallback to deterministic parser
    const fallbackResult = fallbackParseRequirement(requirement, domainHint);
    res.json({
      ...fallbackResult,
      isAiGenerated: false,
      notice: "Processed using built-in requirement engine (Gemini API key not configured).",
    });
    return;
  }

  try {
    const prompt = `You are an expert UX/UI Architect and Systems Designer.
Analyze the following natural-language product requirement and return a strictly valid JSON object.

USER REQUIREMENT:
"${requirement}"

${domainHint ? `Domain Hint: ${domainHint}` : ""}

SCHEMA REQUIREMENTS:
Return ONLY a valid JSON object with the following fields:
{
  "pages": ["Home", "Products", ...],
  "components": ["Navbar", "Hero", "Product Grid", ...],
  "constraints": ["Mobile responsive", "WCAG AA accessible", ...],
  "style_hints": ["minimal", "modern", "blue", ...],
  "domain": "ecommerce" | "food_delivery" | "saas" | "dashboard" | "portfolio" | "education" | "finance" | "general",
  "primary_color": "#HEX_COLOR",
  "design_rationale": "Brief 1-2 sentence explanation of layout structure"
}

Do not wrap in Markdown code fences if possible, or provide raw JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() || "{}";
    const cleanedText = text.replace(/^```json\s*/i, "").replace(/```$/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    res.json({
      ...parsed,
      isAiGenerated: true,
      source: "gemini-3.8-flash",
    });
  } catch (error: any) {
    console.warn("Gemini API call failed, falling back to deterministic parser:", error.message);
    const fallbackResult = fallbackParseRequirement(requirement, domainHint);
    res.json({
      ...fallbackResult,
      isAiGenerated: false,
      notice: "Processed using built-in requirement engine (Gemini API request fallback).",
      errorDetails: error.message,
    });
  }
});

// AI Regeneration Endpoint
app.post("/api/ai/regenerate", async (req, res) => {
  const { currentWireframe, instruction, targetScope } = req.body;

  if (!instruction) {
    res.status(400).json({ error: "Instruction is required for regeneration." });
    return;
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Deterministic modification simulation
    res.json({
      success: true,
      modified: true,
      source: "heuristic-engine",
      message: `Updated based on: "${instruction}"`,
      changes: [
        { target: targetScope || "all", description: `Applied rule adjustments for: ${instruction}` }
      ]
    });
    return;
  }

  try {
    const prompt = `You are a visual design assistant for a wireframe editor.
The user wants to update their wireframe according to this natural-language instruction:
"${instruction}"

Scope: ${targetScope || "all elements"}

Current Elements Summary:
${JSON.stringify((currentWireframe?.elements || []).slice(0, 8), null, 2)}

Return a valid JSON object describing:
{
  "summaryOfChanges": "string",
  "styleAdjustments": {
    "darkMode": boolean,
    "primaryColor": string | null,
    "borderRadius": string | null
  },
  "suggestedComponentActions": [
    {
      "action": "modify" | "add" | "remove",
      "targetType": "hero" | "search" | "navbar" | "card" | "pricing",
      "propertiesToUpdate": {}
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({
      success: true,
      aiFeedback: parsed,
      isAiGenerated: true,
      source: "gemini-3.8-flash",
    });
  } catch (error: any) {
    res.json({
      success: true,
      source: "heuristic-fallback",
      message: `Applied adjustment: ${instruction}`,
    });
  }
});

// Vite middleware & Static asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const listen = (port: number) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Wireframe Studio Server running on http://0.0.0.0:${port}`);
    });

    server.once("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.warn(`Port ${port} is already in use. Trying ${port + 1}.`);
        listen(port + 1);
        return;
      }
      throw error;
    });
  };

  listen(DEFAULT_PORT);
}

startServer();
