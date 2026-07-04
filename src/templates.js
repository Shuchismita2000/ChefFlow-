/**
 * ChefFlow Regional Cuisine Templates and Local Mock Engine Data
 */

export const CUISINE_PROFILES = {
  "us": {
    name: "United States",
    defaultCuisine: "Modern American",
    regions: {
      "southern": "Southern Homestyle (BBQ, grits, greens)",
      "westcoast": "West Coast Fusion (Avocado, salads, grain bowls)",
      "northeast": "Northeast Classic (Clams, chowder, maple, roast)",
      "midwest": "Midwest Comfort (Casseroles, steak, potatoes)"
    }
  },
  "in": {
    name: "India",
    defaultCuisine: "Classic Indian",
    regions: {
      "maharashtra": "Maharashtrian (Poha, Misal, Bhakri, Varan Bhaat)",
      "punjab": "North Indian (Paneer, Roti, Dal Makhani, Paratha)",
      "tamilnadu": "South Indian (Idli, Dosa, Sambar, Rasam)",
      "bengal": "East Indian (Luchi, Chholar Dal, Vegetable Khichdi)"
    }
  },
  "it": {
    name: "Italy",
    defaultCuisine: "Italian Mediterranean",
    regions: {
      "campania": "Neapolitan & Coastal (Tomato, Basil, Pasta, Olive Oil)",
      "tuscany": "Tuscan Rustic (Beans, bread, rosemary, soups)",
      "lombardy": "Northern Italian (Risotto, polenta, butter, sage)"
    }
  },
  "mx": {
    name: "Mexico",
    defaultCuisine: "Mexican Traditional",
    regions: {
      "oaxaca": "Oaxacan (Mole, Tlayudas, black beans)",
      "jalisco": "Jalisco Street Food (Tacos, Birria, Tortas)"
    }
  },
  "jp": {
    name: "Japan",
    defaultCuisine: "Japanese Washoku",
    regions: {
      "kanto": "Tokyo Style (Soba, Sushi, Dashi)",
      "kansai": "Osaka Style (Udon, Takoyaki flavor profiles, light soy)"
    }
  }
};

// Rich preset plans for combinations of: diet + budget level + cuisine region
export const RECIPE_DATABASE = {
  // 1. Balanced - Medium Budget - US Southern
  "balanced_medium_us_southern": {
    meals: {
      breakfast: {
        name: "Southern Peach & Pecan Oatmeal",
        prepTime: 5,
        cookTime: 10,
        energyReq: "Medium",
        calories: 380,
        macros: { protein: 12, carbs: 55, fats: 14 },
        ingredients: [
          { name: "Rolled Oats", amount: "1/2 cup", cost: 0.30, category: "Pantry" },
          { name: "Fresh Peaches", amount: "1 medium", cost: 1.20, category: "Produce", replaceable: true, replaceWith: "Canned Peaches", replaceSavings: 0.80 },
          { name: "Pecan Halves", amount: "2 tbsp", cost: 1.50, category: "Pantry", replaceable: true, replaceWith: "Sunflower Seeds", replaceSavings: 1.10 },
          { name: "Maple Syrup", amount: "1 tbsp", cost: 0.60, category: "Pantry" },
          { name: "Whole Milk", amount: "1 cup", cost: 0.40, category: "Dairy & Eggs" }
        ],
        instructions: [
          "In a small pot, bring milk and oats to a gentle boil.",
          "Reduce heat and simmer for 5 minutes until thickened.",
          "Top with sliced peaches, toasted pecans, and drizzle with maple syrup."
        ]
      },
      lunch: {
        name: "BBQ Pulled Chicken Wrap",
        prepTime: 10,
        cookTime: 0,
        energyReq: "Low",
        calories: 520,
        macros: { protein: 35, carbs: 45, fats: 18 },
        ingredients: [
          { name: "Pre-cooked Chicken Breast", amount: "150g", cost: 3.50, category: "Meat & Seafood", replaceable: true, replaceWith: "Canned Chickpeas", replaceSavings: 2.30 },
          { name: "BBQ Sauce", amount: "2 tbsp", cost: 0.40, category: "Pantry" },
          { name: "Large Tortillas", amount: "1 unit", cost: 0.50, category: "Pantry" },
          { name: "Shredded Cabbage Slaw", amount: "1 cup", cost: 0.80, category: "Produce" },
          { name: "Cheddar Cheese", amount: "1/4 cup", cost: 0.75, category: "Dairy & Eggs" }
        ],
        instructions: [
          "Shred the chicken and mix it with BBQ sauce in a bowl.",
          "Warm the tortilla slightly in a pan.",
          "Layer slaw, cheese, and BBQ chicken, then wrap tightly."
        ]
      },
      dinner: {
        name: "Cajun Shrimp & Grits",
        prepTime: 15,
        cookTime: 20,
        energyReq: "High",
        calories: 640,
        macros: { protein: 42, carbs: 60, fats: 24 },
        ingredients: [
          { name: "Raw Shrimp (peeled)", amount: "200g", cost: 6.00, category: "Meat & Seafood", replaceable: true, replaceWith: "Firm Tofu Cubes", replaceSavings: 4.20 },
          { name: "Stone-Ground Grits", amount: "1/2 cup", cost: 0.40, category: "Pantry" },
          { name: "Cajun Seasoning Blend", amount: "1 tbsp", cost: 0.25, category: "Pantry" },
          { name: "Bell Peppers & Onions", amount: "1 cup sliced", cost: 1.10, category: "Produce" },
          { name: "Butter & Cream", amount: "2 tbsp", cost: 0.60, category: "Dairy & Eggs" }
        ],
        instructions: [
          "Cook grits in water/milk according to package instructions, stirring in butter and cream at the end.",
          "Toss shrimp in Cajun seasoning.",
          "Sauté peppers and onions in a skillet, add shrimp and cook for 3-4 minutes until pink.",
          "Serve shrimp and peppers over the creamy grits."
        ]
      }
    }
  },

  // 2. Vegan - Low Budget - India Maharashtra
  "vegan_low_in_maharashtra": {
    meals: {
      breakfast: {
        name: "Kanda Poha (Savory Flattened Rice)",
        prepTime: 10,
        cookTime: 10,
        energyReq: "Medium",
        calories: 320,
        macros: { protein: 6, carbs: 62, fats: 7 },
        ingredients: [
          { name: "Flattened Rice (Poha)", amount: "1.5 cups", cost: 0.25, category: "Pantry" },
          { name: "Onions (Kanda)", amount: "1 large chopped", cost: 0.15, category: "Produce" },
          { name: "Raw Peanuts", amount: "2 tbsp", cost: 0.20, category: "Pantry" },
          { name: "Mustard Seeds & Turmeric", amount: "1 tsp", cost: 0.10, category: "Pantry" },
          { name: "Fresh Coriander & Lemon", amount: "Garnish", cost: 0.15, category: "Produce" },
          { name: "Green Chilies", amount: "2 units", cost: 0.05, category: "Produce" }
        ],
        instructions: [
          "Wash poha in a colander, drain and keep aside. Add a pinch of salt and sugar to it.",
          "Heat oil in a pan, fry peanuts till crunchy. Remove peanuts.",
          "In the same oil, add mustard seeds, chilies, and turmeric. Sauté onions till soft.",
          "Add poha, peanuts, and mix gently on low flame. Cover and steam for 2 minutes.",
          "Garnish with coriander and lemon juice."
        ]
      },
      lunch: {
        name: "Varan Bhaat with Potato Podi",
        prepTime: 10,
        cookTime: 20,
        energyReq: "Low",
        calories: 450,
        macros: { protein: 12, carbs: 80, fats: 8 },
        ingredients: [
          { name: "Toor Dal (Split Pigeon Peas)", amount: "1/2 cup", cost: 0.35, category: "Pantry" },
          { name: "Basmati Rice", amount: "3/4 cup", cost: 0.40, category: "Pantry" },
          { name: "Turmeric & Hing (Asafoetida)", amount: "1 tsp", cost: 0.08, category: "Pantry" },
          { name: "Potatoes", amount: "2 medium", cost: 0.30, category: "Produce" },
          { name: "Indian Oil / Ghee Substitute", amount: "1 tbsp", cost: 0.20, category: "Pantry" }
        ],
        instructions: [
          "Pressure cook or boil Toor Dal with turmeric, hing, and water until mushy. Mash it.",
          "Cook rice separately.",
          "Dice potatoes, sauté with mustard seeds, chili powder, and salt until crispy.",
          "Serve hot rice topped with simple yellow dal (varan) and crispy potatoes."
        ]
      },
      dinner: {
        name: "Sprouted Moth Bean Usal with Bhakri",
        prepTime: 15,
        cookTime: 25,
        energyReq: "High",
        calories: 510,
        macros: { protein: 20, carbs: 82, fats: 11 },
        ingredients: [
          { name: "Sprouted Moth Beans (Matki)", amount: "1.5 cups", cost: 0.60, category: "Pantry" },
          { name: "Jowar Flour (Sorghum)", amount: "1 cup", cost: 0.35, category: "Pantry", replaceable: true, replaceWith: "Wheat Flour (Rotis)", replaceSavings: 0.10 },
          { name: "Goda Masala Blend", amount: "1.5 tsp", cost: 0.15, category: "Pantry" },
          { name: "Tomato & Onion paste", amount: "1/2 cup", cost: 0.40, category: "Produce" },
          { name: "Grated Coconut", amount: "2 tbsp", cost: 0.30, category: "Pantry", replaceable: true, replaceWith: "Omit Coconut", replaceSavings: 0.30 }
        ],
        instructions: [
          "Knead sorghum flour with hot water to form a soft dough, pat with hands to make flatbhakri bread, cook on hot griddle.",
          "Sauté onion-tomato paste in oil, add goda masala and sprouted beans.",
          "Add water and simmer until beans are cooked soft (approx 15 mins).",
          "Garnish usal with coconut and serve with bhakri."
        ]
      }
    }
  },

  // 3. Balanced - High Budget - Italy Campania
  "balanced_high_it_campania": {
    meals: {
      breakfast: {
        name: "Caprese Baked Eggs with Prosciutto",
        prepTime: 8,
        cookTime: 12,
        energyReq: "Medium",
        calories: 420,
        macros: { protein: 28, carbs: 8, fats: 30 },
        ingredients: [
          { name: "Fresh Eggs", amount: "2 large", cost: 0.80, category: "Dairy & Eggs" },
          { name: "Buffalo Mozzarella", amount: "80g", cost: 3.50, category: "Dairy & Eggs", replaceable: true, replaceWith: "Regular Mozzarella", replaceSavings: 2.10 },
          { name: "Cherry Tomatoes on Vine", amount: "100g", cost: 1.80, category: "Produce" },
          { name: "Prosciutto di Parma", amount: "3 slices", cost: 4.00, category: "Meat & Seafood", replaceable: true, replaceWith: "Crispy Bacon", replaceSavings: 2.80 },
          { name: "Fresh Basil & Olive Oil", amount: "Drizzle", cost: 0.90, category: "Produce" }
        ],
        instructions: [
          "Preheat oven to 400°F (200°C).",
          "In a small baking dish, place cherry tomatoes, tear mozzarella, and crack eggs in between.",
          "Bake for 10-12 minutes until egg whites are set but yolks remain soft.",
          "Top with fresh basil, sea salt, olive oil, and serve with prosciutto slices on the side."
        ]
      },
      lunch: {
        name: "Artisanal Panino with Pesto & Bresaola",
        prepTime: 10,
        cookTime: 0,
        energyReq: "Low",
        calories: 590,
        macros: { protein: 32, carbs: 54, fats: 25 },
        ingredients: [
          { name: "Ciabatta Bread Rolls", amount: "1 roll", cost: 1.50, category: "Pantry" },
          { name: "Bresaola (cured beef)", amount: "70g", cost: 5.00, category: "Meat & Seafood", replaceable: true, replaceWith: "Smoked Turkey", replaceSavings: 3.50 },
          { name: "Wild Arugula (Rocket)", amount: "1 cup", cost: 1.20, category: "Produce" },
          { name: "Basil Pesto", amount: "2 tbsp", cost: 1.00, category: "Pantry" },
          { name: "Parmigiano-Reggiano Shavings", amount: "2 tbsp", cost: 1.50, category: "Dairy & Eggs" }
        ],
        instructions: [
          "Slice ciabatta roll in half and toast lightly.",
          "Spread green basil pesto generously on the base.",
          "Layer cured bresaola, shave fresh Parmigiano-Reggiano, and top with wild arugula.",
          "Close sandwich and press lightly."
        ]
      },
      dinner: {
        name: "Linguine alle Vongole (Clam Pasta)",
        prepTime: 15,
        cookTime: 15,
        energyReq: "High",
        calories: 720,
        macros: { protein: 38, carbs: 90, fats: 18 },
        ingredients: [
          { name: "Fresh Clams in Shell", amount: "400g", cost: 9.00, category: "Meat & Seafood", replaceable: true, replaceWith: "Canned Baby Clams", replaceSavings: 6.00 },
          { name: "Linguine Pasta", amount: "120g", cost: 0.50, category: "Pantry" },
          { name: "Dry White Wine", amount: "1/2 cup", cost: 1.50, category: "Pantry" },
          { name: "Garlic & Olive Oil", amount: "3 cloves", cost: 0.60, category: "Produce" },
          { name: "Flat-Leaf Parsley & Red Chili", amount: "1 bunch", cost: 0.80, category: "Produce" }
        ],
        instructions: [
          "Cook pasta in salted boiling water until very al dente.",
          "Sauté smashed garlic and sliced red chili in olive oil in a deep pan.",
          "Add thoroughly washed clams and white wine. Cover immediately and let steam for 5 minutes until clams open.",
          "Drain pasta and add directly into the clam sauce. Sauté together with fresh chopped parsley and a splash of pasta cooking water for 2 minutes to thicken."
        ]
      }
    }
  }
};

// Fallback generator if a combination is not exactly matched in the pre-defined keys
export function getFallbackTemplate(diet, budgetLevel, country, region) {
  // Let's analyze inputs and build a dynamic custom plan based on default databases!
  // Map standard combinations to make it clean
  const isVegan = diet.toLowerCase() === "vegan";
  const isKeto = diet.toLowerCase() === "keto";
  const isVeg = diet.toLowerCase() === "vegetarian";
  
  const isIndia = country.toLowerCase() === "india" || country.toLowerCase() === "in";
  const isItaly = country.toLowerCase() === "italy" || country.toLowerCase() === "it";
  const isMexico = country.toLowerCase() === "mexico" || country.toLowerCase() === "mx";
  const isJapan = country.toLowerCase() === "japan" || country.toLowerCase() === "jp";
  
  const isLowBudget = budgetLevel === "low" || parseFloat(budgetLevel) < 15;
  const isHighBudget = budgetLevel === "high" || parseFloat(budgetLevel) > 40;
  
  if (isIndia) {
    if (isVegan || isVeg) {
      return RECIPE_DATABASE["vegan_low_in_maharashtra"];
    } else {
      // Create a quick custom variations
      return {
        meals: {
          breakfast: {
            name: "Masala Egg Bhurji (Scramble) & Toast",
            prepTime: 5,
            cookTime: 10,
            energyReq: "Medium",
            calories: 360,
            macros: { protein: 18, carbs: 24, fats: 20 },
            ingredients: [
              { name: "Eggs", amount: "3 units", cost: 0.60, category: "Dairy & Eggs" },
              { name: "Onions & Tomatoes", amount: "1 cup chopped", cost: 0.35, category: "Produce" },
              { name: "Turmeric & Chili Powder", amount: "1 tsp", cost: 0.08, category: "Pantry" },
              { name: "Whole Wheat Bread", amount: "2 slices", cost: 0.30, category: "Pantry" },
              { name: "Butter", amount: "1 tbsp", cost: 0.20, category: "Dairy & Eggs" }
            ],
            instructions: [
              "Sauté chopped onions and tomatoes with chilies in butter.",
              "Add spices, then crack in eggs and scramble gently till set.",
              "Serve hot with toasted bread."
            ]
          },
          lunch: {
            name: "Homestyle Chicken Curry & Basmati Rice",
            prepTime: 15,
            cookTime: 25,
            energyReq: "Low",
            calories: 580,
            macros: { protein: 35, carbs: 65, fats: 16 },
            ingredients: [
              { name: "Chicken Thighs (Bone-in)", amount: "250g", cost: 2.50, category: "Meat & Seafood", replaceable: true, replaceWith: "Soya Chunks / Paneer", replaceSavings: 1.30 },
              { name: "Basmati Rice", amount: "3/4 cup", cost: 0.40, category: "Pantry" },
              { name: "Curry Spices & Oil", amount: "2 tbsp", cost: 0.30, category: "Pantry" },
              { name: "Ginger Garlic Paste & Onion", amount: "1 cup", cost: 0.60, category: "Produce" }
            ],
            instructions: [
              "Brown onions, add ginger-garlic paste and chicken. Sauté 5 minutes.",
              "Add dry spices and a cup of water, simmer covered for 20 minutes until chicken is tender.",
              "Serve with steamed basmati rice."
            ]
          },
          dinner: {
            name: "Yellow Tadka Dal with Roti & Salad",
            prepTime: 10,
            cookTime: 15,
            energyReq: "High",
            calories: 420,
            macros: { protein: 16, carbs: 68, fats: 10 },
            ingredients: [
              { name: "Yellow Moong Dal", amount: "1/2 cup", cost: 0.30, category: "Pantry" },
              { name: "Whole Wheat Flour", amount: "3/4 cup", cost: 0.25, category: "Pantry" },
              { name: "Garlic, Cumin & Ghee", amount: "1 tbsp", cost: 0.40, category: "Pantry" },
              { name: "Cucumber & Carrot Salad", amount: "1 plate", cost: 0.60, category: "Produce" }
            ],
            instructions: [
              "Boil dal with salt and turmeric until smooth.",
              "Prepare a tadka (tempering) by heating ghee, frying cumin seeds, garlic, and chilies, then pour over the hot dal.",
              "Knead flour and roll out fresh rotis. Serve hot with dal and crunchy salad."
            ]
          }
        }
      };
    }
  }

  if (isItaly) {
    if (isHighBudget) {
      return RECIPE_DATABASE["balanced_high_it_campania"];
    }
    // Moderate Italy
    return {
      meals: {
        breakfast: {
          name: "Italian Ricotta & Honey Toast",
          prepTime: 5,
          cookTime: 0,
          energyReq: "Medium",
          calories: 290,
          macros: { protein: 10, carbs: 36, fats: 12 },
          ingredients: [
            { name: "Crusty Italian Bread", amount: "2 slices", cost: 0.60, category: "Pantry" },
            { name: "Fresh Ricotta", amount: "1/3 cup", cost: 1.50, category: "Dairy & Eggs", replaceable: true, replaceWith: "Cottage Cheese", replaceSavings: 0.80 },
            { name: "Honey", amount: "1 tbsp", cost: 0.40, category: "Pantry" },
            { name: "Walnut Pieces", amount: "1 tbsp", cost: 0.80, category: "Pantry", replaceable: true, replaceWith: "Omit Walnuts", replaceSavings: 0.80 }
          ],
          instructions: [
            "Toast the bread slices until golden brown.",
            "Spread ricotta cheese evenly over the warm toast.",
            "Top with walnuts and drizzle with sweet honey."
          ]
        },
        lunch: {
          name: "Caprese Salad with Warm Crusty Bread",
          prepTime: 5,
          cookTime: 0,
          energyReq: "Low",
          calories: 460,
          macros: { protein: 18, carbs: 42, fats: 22 },
          ingredients: [
            { name: "Ripe Roma Tomatoes", amount: "2 large", cost: 0.80, category: "Produce" },
            { name: "Fresh Mozzarella Ball", amount: "100g", cost: 2.20, category: "Dairy & Eggs" },
            { name: "Balsamic Glaze & Olive Oil", amount: "1 tbsp", cost: 0.50, category: "Pantry" },
            { name: "Fresh Basil", amount: "1 bunch", cost: 0.40, category: "Produce" },
            { name: "Ciabatta Slices", amount: "2 pieces", cost: 0.60, category: "Pantry" }
          ],
          instructions: [
            "Slice tomatoes and mozzarella into rounds.",
            "Alternate layers of tomato, mozzarella, and fresh basil leaves on a plate.",
            "Drizzle with olive oil, balsamic glaze, and season with sea salt.",
            "Serve with warm ciabatta bread."
          ]
        },
        dinner: {
          name: "Rustic Tuscan White Bean Stew",
          prepTime: 10,
          cookTime: 20,
          energyReq: "High",
          calories: 520,
          macros: { protein: 22, carbs: 75, fats: 14 },
          ingredients: [
            { name: "Canned Cannelini Beans", amount: "1.5 cans", cost: 1.50, category: "Pantry" },
            { name: "Extra Virgin Olive Oil", amount: "2 tbsp", cost: 0.60, category: "Pantry" },
            { name: "Kale or Spinach", amount: "2 cups", cost: 1.20, category: "Produce", replaceable: true, replaceWith: "Frozen Spinach", replaceSavings: 0.70 },
            { name: "Garlic, Rosemary & Stock", amount: "1 set", cost: 0.80, category: "Pantry" },
            { name: "Italian Sausage", amount: "100g", cost: 2.00, category: "Meat & Seafood", replaceable: true, replaceWith: "More White Beans (Vegan/Budget)", replaceSavings: 1.20 }
          ],
          instructions: [
            "Sauté sausage (if using) and garlic with rosemary in olive oil in a heavy pot.",
            "Add white beans (with liquid) and vegetable stock. Bring to a simmer.",
            "Stir in chopped kale/spinach, letting it wilt for 5-10 minutes.",
            "Season with salt and pepper, serve warm with a drizzle of premium olive oil."
          ]
        }
      }
    };
  }

  // General default: Modern American/Balanced/Medium Budget
  return RECIPE_DATABASE["balanced_medium_us_southern"];
}
