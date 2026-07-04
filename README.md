# ChefFlow - AI Cooking Macro & Todo Planner 🍳✨

ChefFlow is an ultra-premium, interactive Single Page Application (SPA) designed to solve the friction of daily meal planning, grocery budgeting, and cooking schedules. It builds a personalized, chronological cooking timeline tailored around the user's busy calendar events and energy levels, while performing live budget optimization.

## Key Features

1. **Structured Schedule-Aware Wizard**:
   - Schedule cooking slots around busy slots (e.g., working hours, gym schedules).
   - Calibrates meal prep time according to energy levels (Low/Medium/High).
   - Tailors cuisine suggestions, regional names, and currency based on user's **Country**, **State**, and **Living Location**.

2. **Feasibility Budget Dashboard**:
   - Dynamic tracker checking estimated grocery pricing against your budget limit.
   - Highlights cost overrun risks with visual color-coded progress bars.

3. **Smart Budget Swaps**:
   - Spotlights expensive ingredients and suggests cost-saving substitutions (e.g. fresh salmon to canned tuna, premium cuts to tofu/beans).
   - Single-click **"Apply Swap"** instantly modifies the recipes, updates the grocery shop checklist, and recalculates the budget.

4. **Live Grocery Shopping Checklist**:
   - Items grouped by aisle (Produce, Dairy, Pantry, etc.) to optimize the shopping run.
   - Interactive price fields letting you adjust prices in real time, triggering instant recalculations of the dashboard.

5. **Chronological Cooking Timeline & Step Timers**:
   - Time-blocked tasks guiding when to prep, cook, and eat.
   - Expanding recipes with calories, prep/cooking times, and macro charts (Protein/Carbs/Fat gauges).
   - Built-in countdown timers on instruction steps which float on the bottom right and play a chime when finished!

6. **Dual Mode Execution**:
   - **Simulator Mode**: Works out of the box with highly calibrated mock templates mapping user's cuisine regions and budget options offline.
   - **Gemini AI Mode**: Connects directly via client-side fetch to the Google Gemini API with a user-supplied API key.

---

## Technical Stack & Architecture

- **Build Tool**: [Vite](https://vitejs.dev/)
- **Core Logic**: Modern Modular JavaScript (ES6)
- **Styling**: Premium Glassmorphic Vanilla CSS (Outfit & Plus Jakarta Sans fonts)
- **Vector Icons**: Lucide Icons (CDN)

---

## Running Locally

To run the developer server locally, execute the following commands in the workspace root:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Open the local host link (typically `http://localhost:5173`) in your browser to experience ChefFlow.
