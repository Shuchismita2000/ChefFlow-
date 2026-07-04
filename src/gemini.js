/**
 * ChefFlow Gemini API Connector
 */

import { getFallbackTemplate } from './templates.js';

// Retrieve API Key from local storage
export function getStoredApiKey() {
  return localStorage.getItem('chefflow_api_key') || '';
}

// Store API Key in local storage
export function setStoredApiKey(key) {
  if (key) {
    localStorage.setItem('chefflow_api_key', key.trim());
  } else {
    localStorage.removeItem('chefflow_api_key');
  }
}

// Main generation function
export async function generateChefPlan(formData) {
  const apiKey = getStoredApiKey();

  // If no API Key is provided, fallback to the offline mock simulator
  if (!apiKey) {
    console.log("No API key configured. Running local ChefFlow simulator...");
    return simulatePlanLocal(formData);
  }

  try {
    const prompt = buildGeminiPrompt(formData);
    const result = await callGeminiAPI(apiKey, prompt);
    return validateAndNormalizeResponse(result, formData);
  } catch (error) {
    console.error("Gemini API error, falling back to simulator:", error);
    // Show notification to UI if possible (will handle in main.js)
    throw new Error(error.message || "Failed to generate plan from Gemini API.");
  }
}

// Build Prompt
function buildGeminiPrompt(data) {
  const {
    wakeTime,
    sleepTime,
    energy,
    busySlots, // Array of { start, end, label }
    country,
    state,
    city,
    diet,
    budget,
    currency,
    people,
    fridge
  } = data;

  const busySlotsStr = busySlots && busySlots.length > 0 
    ? busySlots.map(s => `- From ${s.start} to ${s.end} is busy with "${s.label}"`).join('\n')
    : "No major busy slots, open schedule.";

  return `
You are ChefFlow AI, a world-class premium culinary planner and nutritionist.
Generate a complete, highly-personalized Cooking Schedule, Meal Plan, and Grocery List with budget optimization based on the user's daily schedule.

USER PROFILE:
- **Location**: ${city ? city + ', ' : ''}${state ? state + ', ' : ''}${country || 'United States'}
  *Tailor recipes to local cuisine styles, regional ingredient names, and estimate local grocery pricing in ${currency || '$'}.*
- **Dietary Restriction**: ${diet || 'None'}
- **Schedule**:
  - Wake up: ${wakeTime || '7:00 AM'}
  - Sleep: ${sleepTime || '11:00 PM'}
  - Busy Slots (DO NOT schedule cooking, prep, or eating during these times):
${busySlotsStr}
- **Cooking Energy Level**: ${energy || 'Medium'} (If low, recommend very simple, quick meals under 15 mins. If high, more elaborate meals are fine.)
- **Daily Budget Goal**: ${currency || '$'}${budget || '25.00'} for ${people || '1'} person(s).
- **Available Ingredients in Fridge**: ${fridge || 'None'} (Prioritize using these to lower the grocery bill. For these items, set cost to 0.00 in the grocery list!)

YOUR GOAL:
Produce three meals (breakfast, lunch, dinner) and an interactive cooking todo timeline.
If the estimated cost of all ingredients exceeds the budget of ${currency || '$'}${budget}, you MUST provide at least 2 budget substitutions/swaps that lower the cost below budget.

YOU MUST RESPOND WITH ONLY A JSON OBJECT. DO NOT USE MARKDOWN CODE BLOCKS.
The JSON object must strictly match this schema:

{
  "meals": {
    "breakfast": {
      "name": "Name of breakfast recipe",
      "prepTime": 10, // minutes
      "cookTime": 15, // minutes
      "energyReq": "Low/Medium/High",
      "calories": 400,
      "macros": { "protein": 15, "carbs": 45, "fats": 10 },
      "ingredients": [
        { "name": "Ingredient Name", "amount": "1/2 cup", "cost": 0.50, "category": "Pantry/Produce/Meat & Seafood/Dairy & Eggs", "replaceable": true, "replaceWith": "Cheaper Alternative", "replaceSavings": 0.20 }
      ],
      "instructions": ["Step 1...", "Step 2..."]
    },
    "lunch": {
      "name": "Name of lunch recipe",
      "prepTime": 10,
      "cookTime": 0,
      "energyReq": "Low/Medium/High",
      "calories": 550,
      "macros": { "protein": 30, "carbs": 50, "fats": 15 },
      "ingredients": [
         { "name": "Ingredient Name", "amount": "100g", "cost": 2.50, "category": "Pantry/Produce/Meat & Seafood/Dairy & Eggs", "replaceable": false }
      ],
      "instructions": ["Step 1..."]
    },
    "dinner": {
      "name": "Name of dinner recipe",
      "prepTime": 15,
      "cookTime": 25,
      "energyReq": "Low/Medium/High",
      "calories": 650,
      "macros": { "protein": 35, "carbs": 60, "fats": 20 },
      "ingredients": [
         { "name": "Ingredient Name", "amount": "200g", "cost": 4.00, "category": "Pantry/Produce/Meat & Seafood/Dairy & Eggs", "replaceable": true, "replaceWith": "Cheaper Alternative", "replaceSavings": 1.50 }
      ],
      "instructions": ["Step 1..."]
    }
  },
  "timeline": [
    {
      "time": "7:30 AM", // specific timestamp that is outside their busy windows and fits chronological flow
      "action": "Briefly describe the task, e.g., Prepare and eat Southern Oatmeal",
      "duration": 15, // minutes total
      "meal": "breakfast", // "breakfast", "lunch", "dinner", or "prep"
      "energyRequirement": "Low/Medium/High"
    }
  ],
  "budgetFeasibility": {
    "totalEstimatedCost": 15.50, // sum of all ingredient costs (items in user fridge cost 0.00)
    "currencySymbol": "${currency || '$'}",
    "isFeasible": true, // true if totalEstimatedCost <= daily budget
    "message": "A brief summary of budget state, e.g., 'Awesome! Your meals fit perfectly within budget.'"
  },
  "suggestedSwaps": [
    {
      "originalItem": "Original expensive item name",
      "suggestedItem": "Cheaper alternative name",
      "savings": 2.50,
      "mealAffected": "lunch", // "breakfast", "lunch", or "dinner"
      "reason": "Explain why, e.g., 'Using canned beans instead of premium beef saves money while preserving protein.'"
    }
  ]
}
`;
}

// Call Gemini API via fetch
async function callGeminiAPI(apiKey, prompt) {
  const model = "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    })
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const message = errorJson.error?.message || `HTTP ${response.status} Error`;
    throw new Error(`Gemini API request failed: ${message}`);
  }

  const data = await response.json();
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("No response content generated by Gemini.");
  }

  const text = data.candidates[0].content.parts[0].text;
  const parsed = JSON.parse(text);
  parsed._debug = {
    prompt: prompt,
    rawResponse: text,
    isRealCall: true
  };
  return parsed;
}

// Simulator backup engine mapping inputs to preset models
function simulatePlanLocal(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const diet = (data.diet || "balanced").toLowerCase();
      const countryCode = getCountryCode(data.country);
      const stateKey = getStateKey(data.state);
      
      // Determine budget level
      let budgetLevel = "medium";
      const totalBudget = parseFloat(data.budget) || 25;
      if (totalBudget < 15) budgetLevel = "low";
      if (totalBudget > 40) budgetLevel = "high";

      // Try to find matching template
      const templateKey = `${diet}_${budgetLevel}_${countryCode}_${stateKey}`;
      let planData = getFallbackTemplate(diet, budgetLevel, data.country, data.state);

      // Clone plan data to avoid modifying reference
      planData = JSON.parse(JSON.stringify(planData));

      // Construct a customized cooking timeline based on user schedule
      const timeline = buildTimelineForSchedule(data, planData.meals);

      // Calculate actual grocery cost
      let totalCost = 0;
      const fridgeList = (data.fridge || "").toLowerCase().split(',').map(i => i.trim()).filter(Boolean);
      
      const mealsArray = ['breakfast', 'lunch', 'dinner'];
      const suggestedSwaps = [];

      mealsArray.forEach(mKey => {
        const meal = planData.meals[mKey];
        meal.ingredients.forEach(ing => {
          // If in fridge, cost is zero!
          const inFridge = fridgeList.some(f => ing.name.toLowerCase().includes(f) || f.includes(ing.name.toLowerCase()));
          if (inFridge) {
            ing.cost = 0;
          }
          totalCost += ing.cost;

          // Collect swaps
          if (ing.replaceable && ing.replaceWith) {
            suggestedSwaps.push({
              originalItem: ing.name,
              suggestedItem: ing.replaceWith,
              savings: ing.replaceSavings || 1.0,
              mealAffected: mKey,
              reason: `Swap ${ing.name} for ${ing.replaceWith} to reduce local costs.`
            });
          }
        });
      });

      const currency = data.currency || "$";
      const budgetFeasible = {
        totalEstimatedCost: parseFloat(totalCost.toFixed(2)),
        currencySymbol: currency,
        isFeasible: totalCost <= totalBudget,
        message: totalCost <= totalBudget 
          ? `Perfect! Total cost (${currency}${totalCost.toFixed(2)}) is well within your budget limit.`
          : `Attention: Total cost (${currency}${totalCost.toFixed(2)}) exceeds your daily budget of ${currency}${totalBudget.toFixed(2)}.`
      };

      const result = {
        meals: planData.meals,
        timeline: timeline,
        budgetFeasibility: budgetFeasible,
        suggestedSwaps: suggestedSwaps
      };

      result._debug = {
        prompt: `[LOCAL SIMULATOR ENGINE (OFFLINE STATE)]\n- Region: ${data.city || ''}, ${data.state || ''}, ${data.country || 'United States'}\n- Diet Target: ${data.diet}\n- Goals: ${data.goal}\n- Budget Target: ${currency}${data.budget} for ${data.people} person(s)\n- Wake time: ${data.wakeTime}, Sleep time: ${data.sleepTime}\n- Fridge items: ${data.fridge || 'None'}`,
        rawResponse: JSON.stringify(result, null, 2),
        isRealCall: false
      };

      resolve(result);
    }, 1500); // 1.5s delay to make it feel like AI is thinking
  });
}

// Help map text to country code
function getCountryCode(country = '') {
  const c = country.toLowerCase().trim();
  if (c.includes("india") || c === "in") return "in";
  if (c.includes("italy") || c === "it") return "it";
  if (c.includes("japan") || c === "jp") return "jp";
  if (c.includes("mexico") || c === "mx") return "mx";
  return "us"; // Default US
}

// Help map text to state key
function getStateKey(state = '') {
  const s = state.toLowerCase().trim();
  if (s.includes("south") || s.includes("texas") || s.includes("georgia") || s.includes("carolina") || s.includes("louisiana")) return "southern";
  if (s.includes("california") || s.includes("oregon") || s.includes("washington") || s.includes("west")) return "westcoast";
  if (s.includes("maharashtra") || s === "mh") return "maharashtra";
  if (s.includes("punjab") || s === "pb") return "punjab";
  if (s.includes("tamil") || s === "tn") return "tamilnadu";
  if (s.includes("bengal") || s === "wb") return "bengal";
  if (s.includes("campania") || s.includes("naples")) return "campania";
  if (s.includes("tuscany") || s.includes("florence")) return "tuscany";
  return "southern"; // Default/Southern
}

// Logic to build cooking todo list outside busy slots
function buildTimelineForSchedule(data, meals) {
  const { wakeTime, sleepTime, busySlots = [] } = data;
  
  // Basic scheduling rules:
  // Breakfast: 45 mins after wake time
  // Lunch: around 12:30 PM (or 5.5 hours after wake time)
  // Dinner: around 7:30 PM (or 12.5 hours after wake time)
  // Let's parse time strings like "7:30 AM" into relative minutes from midnight
  
  const wakeMins = parseTimeToMinutes(wakeTime || "7:00 AM");
  const sleepMins = parseTimeToMinutes(sleepTime || "11:00 PM");
  
  const busyRanges = busySlots.map(s => ({
    start: parseTimeToMinutes(s.start),
    end: parseTimeToMinutes(s.end),
    label: s.label
  }));

  const findFreeSlot = (targetMins, durationMins) => {
    let current = targetMins;
    // Iterate forward until we find a block that doesn't overlap with any busy slots and is before sleep
    while (current + durationMins < sleepMins) {
      let overlap = false;
      for (const slot of busyRanges) {
        if ((current >= slot.start && current < slot.end) || 
            (current + durationMins > slot.start && current + durationMins <= slot.end) ||
            (current <= slot.start && current + durationMins >= slot.end)) {
          overlap = true;
          // Shift past this busy slot
          current = slot.end + 10; 
          break;
        }
      }
      if (!overlap) {
        return current;
      }
    }
    return targetMins; // fallback
  };

  const timeline = [];

  // 1. Breakfast Schedule
  const idealBfst = wakeMins + 45;
  const bfstDuration = (meals.breakfast.prepTime || 5) + (meals.breakfast.cookTime || 10) + 15; // include 15 mins eating time
  const bfstStart = findFreeSlot(idealBfst, bfstDuration);
  timeline.push({
    time: formatMinutesToTime(bfstStart),
    action: `Prep and cook ${meals.breakfast.name}`,
    duration: (meals.breakfast.prepTime || 5) + (meals.breakfast.cookTime || 10),
    meal: "breakfast",
    energyRequirement: meals.breakfast.energyReq || "Medium"
  });

  // 2. Lunch Schedule
  const idealLunch = Math.max(bfstStart + 240, parseTimeToMinutes("1:00 PM"));
  const lunchDuration = (meals.lunch.prepTime || 5) + (meals.lunch.cookTime || 0) + 20;
  const lunchStart = findFreeSlot(idealLunch, lunchDuration);
  timeline.push({
    time: formatMinutesToTime(lunchStart),
    action: `Assemble and eat ${meals.lunch.name}`,
    duration: (meals.lunch.prepTime || 5) + (meals.lunch.cookTime || 0),
    meal: "lunch",
    energyRequirement: meals.lunch.energyReq || "Low"
  });

  // 3. Dinner Prep & Cooking Schedule
  const idealDinner = Math.max(lunchStart + 300, parseTimeToMinutes("7:30 PM"));
  const dinnerDuration = (meals.dinner.prepTime || 10) + (meals.dinner.cookTime || 15) + 30;
  const dinnerStart = findFreeSlot(idealDinner, dinnerDuration);

  // If dinner has long cook time, let's suggest a prep step earlier if possible, otherwise keep it simple
  if (meals.dinner.prepTime > 12) {
    const prepStart = findFreeSlot(dinnerStart - 120, 10); // 2 hours before dinner
    timeline.push({
      time: formatMinutesToTime(prepStart),
      action: `Prep ingredients for ${meals.dinner.name} (Chop vegetables, marinate/season)`,
      duration: meals.dinner.prepTime,
      meal: "prep",
      energyRequirement: "Low"
    });

    timeline.push({
      time: formatMinutesToTime(dinnerStart),
      action: `Cook and serve dinner: ${meals.dinner.name}`,
      duration: meals.dinner.cookTime,
      meal: "dinner",
      energyRequirement: meals.dinner.energyReq || "High"
    });
  } else {
    timeline.push({
      time: formatMinutesToTime(dinnerStart),
      action: `Cook and plate ${meals.dinner.name}`,
      duration: (meals.dinner.prepTime || 10) + (meals.dinner.cookTime || 15),
      meal: "dinner",
      energyRequirement: meals.dinner.energyReq || "High"
    });
  }

  return timeline;
}

// String parse: "7:30 AM" -> 450
function parseTimeToMinutes(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 480; // default 8:00 AM
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const meridian = match[3].toUpperCase();
  
  if (meridian === "PM" && hours !== 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}

// Convert minutes to "7:30 AM" format
function formatMinutesToTime(minutes) {
  let hours = Math.floor(minutes / 60) % 24;
  const mins = Math.floor(minutes % 60);
  const meridian = hours >= 12 ? "PM" : "AM";
  
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  
  const minPad = mins.toString().padStart(2, '0');
  return `${hours}:${minPad} ${meridian}`;
}

// Validate the AI output matches what is required
function validateAndNormalizeResponse(res, formData) {
  // Enforce correct fields and format
  if (!res.meals || !res.meals.breakfast || !res.meals.lunch || !res.meals.dinner) {
    throw new Error("API response is missing required meal categories.");
  }
  
  if (!res.timeline || !Array.isArray(res.timeline)) {
    res.timeline = buildTimelineForSchedule(formData, res.meals);
  }
  
  if (!res.budgetFeasibility) {
    // calculate manually
    let cost = 0;
    const meals = ['breakfast', 'lunch', 'dinner'];
    meals.forEach(m => {
      res.meals[m].ingredients.forEach(i => cost += (i.cost || 0));
    });
    res.budgetFeasibility = {
      totalEstimatedCost: parseFloat(cost.toFixed(2)),
      currencySymbol: formData.currency || "$",
      isFeasible: cost <= (parseFloat(formData.budget) || 25),
      message: "Recalculated budget feasibility."
    };
  }

  if (!res.suggestedSwaps) {
    res.suggestedSwaps = [];
  }

  return res;
}
