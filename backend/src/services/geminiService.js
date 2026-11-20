
const { GoogleGenAI } = require("@google/genai");

// Gemini models
const PRIMARY_MODEL = "gemini-3.5-flash-lite";
const FALLBACK_MODEL = "gemini-3.8-flash";

const MAX_ATTEMPTS_PER_MODEL = 1;
const REQUEST_TIMEOUT = 60000;

const RETRYABLE_STATUS_CODES = [
  408, 429, 500, 502, 503, 504
];

/**
 * Extract HTTP status from Gemini errors.
 */
function getErrorStatus(error) {
  if (error?.status) return Number(error.status);
  if (error?.statusCode) return Number(error.statusCode);

  const message = error?.message || "";
  const match = message.match(/\b(408|429|500|502|503|504)\b/);

  return match ? Number(match[0]) : null;
}

/**
 * Check whether fallback should be attempted.
 */
function shouldUseFallback(error) {
  return RETRYABLE_STATUS_CODES.includes(getErrorStatus(error));
}

/**
 * Extract JSON from Gemini response.
 */
function extractJSON(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Gemini returned an empty response.");
  }

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini response does not contain valid JSON.");
  }

  return JSON.parse(cleaned.substring(start, end + 1));
}

/**
 * Normalize Gemini output to match MVPPlan.js schema.
 */
function normalizeMVPPlan(plan) {
  // targetUsers must be a String
  const targetUsers = Array.isArray(plan.targetUsers)
    ? plan.targetUsers.join(", ")
    : String(plan.targetUsers || "");

  // technologyStack must be an Object
  const technologyStack = {
    frontend: "",
    backend: "",
    database: "",
    aiTools: "",
    other: ""
  };

  if (Array.isArray(plan.technologyStack)) {
    plan.technologyStack.forEach((item) => {
      const category = String(item.category || "").toLowerCase();
      const technology = item.technology || "";

      if (category.includes("frontend")) {
        technologyStack.frontend = technology;
      } else if (category.includes("backend")) {
        technologyStack.backend = technology;
      } else if (category.includes("database")) {
        technologyStack.database = technology;
      } else if (category.includes("ai")) {
        technologyStack.aiTools = technology;
      } else {
        technologyStack.other +=
          `${technologyStack.other ? ", " : ""}${technology}`;
      }
    });
  } else if (
    plan.technologyStack &&
    typeof plan.technologyStack === "object"
  ) {
    Object.assign(technologyStack, plan.technologyStack);
  }

  // developmentRoadmap must have numeric phase values
  const developmentRoadmap = (
    Array.isArray(plan.developmentRoadmap)
      ? plan.developmentRoadmap
      : []
  ).map((item, index) => {
    const parsedPhase = Number(
      String(item.phase || "").replace(/\D/g, "")
    );

    return {
      phase: parsedPhase || index + 1,
      title: item.title || `Phase ${index + 1}`,
      duration: item.duration || "Not specified",
      tasks: Array.isArray(item.tasks) ? item.tasks : []
    };
  });

  // successMetrics requires timeline
  const successMetrics = (
    Array.isArray(plan.successMetrics) ? plan.successMetrics : []
  ).map((item) => ({
    metric: item.metric || "Success metric",
    target: item.target || "Not specified",
    timeline:
      item.timeline ||
      plan.estimatedTimeline ||
      "3-6 months"
  }));

  return {
    problemStatement: plan.problemStatement || "",
    proposedSolution: plan.proposedSolution || "",
    targetUsers,
    valueProposition: plan.valueProposition || "",

    coreFeatures: Array.isArray(plan.coreFeatures)
      ? plan.coreFeatures.map((item) => ({
          name: item.name || "",
          description: item.description || "",
          priority: ["High", "Medium", "Low"].includes(item.priority)
            ? item.priority
            : "High",
          estimatedTime: item.estimatedTime || ""
        }))
      : [],

    optionalFeatures: Array.isArray(plan.optionalFeatures)
      ? plan.optionalFeatures.map((item) => ({
          name: item.name || "",
          description: item.description || "",
          priority: ["High", "Medium", "Low"].includes(item.priority)
            ? item.priority
            : "Medium"
        }))
      : [],

    technologyStack,

    developmentRoadmap,

    risks: Array.isArray(plan.risks)
      ? plan.risks.map((item) => ({
          risk: item.risk || "",
          mitigation: item.mitigation || "",
          severity: ["High", "Medium", "Low"].includes(item.severity)
            ? item.severity
            : "Medium"
        }))
      : [],

    successMetrics,

    estimatedTimeline: plan.estimatedTimeline || "3-6 months"
  };
}

/**
 * Validate the normalized plan.
 */
function validateMVPPlan(plan) {
  const requiredFields = [
    "problemStatement",
    "proposedSolution",
    "targetUsers",
    "valueProposition",
    "coreFeatures",
    "optionalFeatures",
    "technologyStack",
    "developmentRoadmap",
    "risks",
    "successMetrics",
    "estimatedTimeline"
  ];

  const missingFields = requiredFields.filter(
    (field) => plan[field] === undefined || plan[field] === null
  );

  if (missingFields.length > 0) {
    throw new Error(
      `MVP plan is missing fields: ${missingFields.join(", ")}`
    );
  }

  if (
    !plan.coreFeatures.length ||
    !plan.developmentRoadmap.length
  ) {
    throw new Error("MVP plan is missing core features or roadmap phases.");
  }

  return plan;
}

/**
 * Build prompt using actual StartupProject schema fields.
 */
function buildPrompt(project) {
  return `
You are an expert startup consultant and software architect.

Generate a practical and detailed MVP plan for the following startup.

PROJECT NAME:
${project.title || "Untitled Startup"}

INDUSTRY:
${project.industry || "Not specified"}

PROBLEM STATEMENT:
${project.problem || "Not specified"}

TARGET AUDIENCE:
${project.targetAudience || "Not specified"}

BUSINESS IDEA:
${project.businessIdea || "Not specified"}

TARGET LAUNCH TIMELINE:
${project.timeline || "Not specified"}

ADDITIONAL REQUIREMENTS:
${project.additionalRequirements || "None"}

Return ONLY valid JSON. Do not include Markdown or explanations.

Follow this exact structure:

{
  "problemStatement": "Detailed problem statement",
  "proposedSolution": "Detailed proposed solution",
  "targetUsers": "Comma-separated target user groups",
  "valueProposition": "Unique value proposition",
  "coreFeatures": [
    {
      "name": "Feature name",
      "description": "Feature description",
      "priority": "High",
      "estimatedTime": "2 weeks"
    }
  ],
  "optionalFeatures": [
    {
      "name": "Feature name",
      "description": "Feature description",
      "priority": "Medium"
    }
  ],
  "technologyStack": {
    "frontend": "React.js",
    "backend": "Node.js and Express.js",
    "database": "MongoDB",
    "aiTools": "Google Gemini API",
    "other": "Other tools"
  },
  "developmentRoadmap": [
    {
      "phase": 1,
      "title": "Planning and Design",
      "duration": "2 weeks",
      "tasks": ["Task 1", "Task 2"]
    }
  ],
  "risks": [
    {
      "risk": "Risk description",
      "mitigation": "Mitigation strategy",
      "severity": "High"
    }
  ],
  "successMetrics": [
    {
      "metric": "Metric name",
      "target": "Measurable target",
      "timeline": "3 months"
    }
  ],
  "estimatedTimeline": "3-6 months"
}

IMPORTANT RULES:
- Include at least 5 core features.
- Include at least 3 optional features.
- Include at least 2 risks.
- Include at least 2 success metrics.
- Include at least 3 roadmap phases.
- Roadmap phase must be a NUMBER, not a string.
- targetUsers must be a STRING, not an array.
- technologyStack must be an OBJECT, not an array.
- Each success metric must include timeline.
- Use only High, Medium or Low for priorities and severity.
- Respect the user's technology requirements.
- Make the plan specific to the startup idea.
- Return valid JSON only.
`;
}

/**
 * Generate content using one Gemini model.
 */
async function generateWithModel(ai, model, prompt) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
    try {
      console.log(
        `[Gemini] Model: ${model} | Attempt ${attempt}/${MAX_ATTEMPTS_PER_MODEL}`
      );

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text;

      if (!responseText) {
        throw new Error("Gemini returned an empty response.");
      }

      console.log(`[Gemini] Generation successful using ${model}`);

      return responseText;

    } catch (error) {
      lastError = error;

      console.error(
        `[Gemini] ${model} failed. Status: ${
          getErrorStatus(error) || "Unknown"
        }`
      );

      console.error(`[Gemini] Error: ${error.message}`);
    }
  }

  throw lastError;
}

/**
 * Try primary model and then fallback model.
 */
async function generateWithRetry(ai, prompt) {
  try {
    return await generateWithModel(ai, PRIMARY_MODEL, prompt);

  } catch (primaryError) {
    if (!shouldUseFallback(primaryError)) {
      throw primaryError;
    }

    console.warn(
      `[Gemini] Switching to fallback model: ${FALLBACK_MODEL}`
    );

    try {
      return await generateWithModel(ai, FALLBACK_MODEL, prompt);

    } catch (fallbackError) {
      console.error("[Gemini] Both models failed.");

      throw new Error(
        `Gemini generation failed. Primary: ${primaryError.message}. ` +
        `Fallback: ${fallbackError.message}`
      );
    }
  }
}

/**
 * Main function called by projectController.js.
 */
async function generateMVPPlan(project) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from backend .env");
  }

  if (!project || typeof project !== "object") {
    throw new Error("Valid project information is required.");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: REQUEST_TIMEOUT,
      retryOptions: {
        attempts: 1
      }
    }
  });

  const prompt = buildPrompt(project);

  console.log("[Gemini] Starting MVP plan generation...");

  const responseText = await generateWithRetry(ai, prompt);

  const parsedPlan = extractJSON(responseText);

  const normalizedPlan = normalizeMVPPlan(parsedPlan);

  const validatedPlan = validateMVPPlan(normalizedPlan);

  console.log("[Gemini] MVP plan generated and validated successfully.");

  return {
    ...validatedPlan,
    rawResponse: responseText
  };
}

module.exports = {
  generateMVPPlan
};
