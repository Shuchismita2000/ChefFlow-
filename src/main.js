/**
 * ChefFlow Main Controller
 */

import { generateChefPlan, getStoredApiKey, setStoredApiKey } from './gemini.js';

// Global Application State
let appState = {
  activeStep: 1,
  totalSteps: 5,
  busySlots: [
    { start: "09:00", end: "17:00", label: "Work Schedule" } // Pre-populate with a standard work day
  ],
  currentPlan: null,
  activeTimerInterval: null,
  appliedSwaps: new Set() // Keeps track of IDs of applied swaps
};

// DOM Elements
const elements = {
  // Wizard elements
  wizardPanel: document.getElementById('wizard-panel'),
  wizardSteps: document.querySelectorAll('.wizard-step'),
  stepIndicators: document.querySelectorAll('.step-indicator'),
  btnPrev: document.getElementById('btn-wizard-prev'),
  btnNext: document.getElementById('btn-wizard-next'),
  busySlotsContainer: document.getElementById('busy-slots-container'),
  btnAddSlot: document.getElementById('btn-add-slot'),
  newSlotLabel: document.getElementById('new-slot-label'),
  newSlotStart: document.getElementById('new-slot-start'),
  newSlotEnd: document.getElementById('new-slot-end'),
  wizardApiKey: document.getElementById('wizard-api-key'),
  countrySelect: document.getElementById('country'),
  currencySelect: document.getElementById('currency'),
  
  // Dashboard elements
  mainDashboard: document.getElementById('main-dashboard'),
  timelineContainer: document.getElementById('timeline-container'),
  mealsContainer: document.getElementById('meals-container'),
  groceryAislesContainer: document.getElementById('grocery-aisles-container'),
  swapsContainer: document.getElementById('swaps-container'),
  swapsList: document.getElementById('swaps-list'),
  btnResetWizard: document.getElementById('btn-reset-wizard'),
  
  // Budget elements
  budgetLimitText: document.getElementById('budget-stat-limit'),
  budgetCostText: document.getElementById('budget-stat-cost'),
  budgetProgressBar: document.getElementById('budget-progress-bar'),
  budgetMessageBox: document.getElementById('budget-message-box'),
  budgetGlow: document.getElementById('budget-glow'),
  
  // API Modal elements
  btnApiConfig: document.getElementById('btn-api-config'),
  apiStatusText: document.getElementById('api-status-text'),
  apiModal: document.getElementById('api-modal'),
  apiKeyInput: document.getElementById('api-key-input'),
  btnApiSave: document.getElementById('btn-api-save'),
  btnApiClear: document.getElementById('btn-api-clear'),
  btnApiClose: document.getElementById('btn-api-close'),
  
  // Timer elements
  timerWidget: document.getElementById('cooking-timer-widget'),
  timerLabel: document.getElementById('timer-label'),
  timerDisplay: document.getElementById('timer-display'),
  btnCloseTimer: document.getElementById('btn-close-timer'),
  
  // Loader Elements
  loadingOverlay: document.getElementById('loading-overlay'),
  loadingStatus: document.getElementById('loading-status'),

  // Dev Console elements
  devConsolePanel: document.getElementById('dev-console-panel'),
  devConsoleContent: document.getElementById('dev-console-content'),
  devConsoleTrigger: document.getElementById('dev-console-trigger'),
  devModelName: document.getElementById('dev-model-name'),
  devApiStatus: document.getElementById('dev-api-status'),
  devApiLatency: document.getElementById('dev-api-latency'),
  devPromptText: document.getElementById('dev-prompt-text'),
  devResponseJson: document.getElementById('dev-response-json')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initWizardNavigation();
  initBusySlots();
  initPills();
  initApiConfig();
  initTimerWidget();
  updateApiBadge();

  // Automatic Currency mapping based on Country selection
  elements.countrySelect.addEventListener('change', () => {
    const val = elements.countrySelect.value;
    if (val === "India") {
      elements.currencySelect.value = "₹";
    } else if (val === "Italy") {
      elements.currencySelect.value = "€";
    } else if (val === "Japan") {
      elements.currencySelect.value = "¥";
    } else if (val === "United States" || val === "Mexico") {
      elements.currencySelect.value = "$";
    }
  });

  // Expandable Developer Console toggle
  elements.devConsoleTrigger.addEventListener('click', () => {
    elements.devConsoleContent.classList.toggle('active');
    const icon = elements.devConsoleTrigger.querySelector('.lucide-chevron-down');
    if (elements.devConsoleContent.classList.contains('active')) {
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  });
  
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// API Config Modal Handlers
function initApiConfig() {
  // Pre-fill wizard API input from local storage
  elements.wizardApiKey.value = getStoredApiKey();

  // Sync wizard input instantly to local storage
  elements.wizardApiKey.addEventListener('input', () => {
    const key = elements.wizardApiKey.value.trim();
    setStoredApiKey(key);
    updateApiBadge();
    elements.apiKeyInput.value = key;
  });

  elements.btnApiConfig.addEventListener('click', () => {
    elements.apiKeyInput.value = getStoredApiKey();
    elements.apiModal.classList.add('active');
  });

  elements.btnApiClose.addEventListener('click', () => {
    elements.apiModal.classList.remove('active');
  });

  elements.btnApiSave.addEventListener('click', () => {
    const key = elements.apiKeyInput.value.trim();
    setStoredApiKey(key);
    elements.wizardApiKey.value = key;
    updateApiBadge();
    elements.apiModal.classList.remove('active');
    showNotification(key ? "Gemini API key saved!" : "API key cleared.");
  });

  elements.btnApiClear.addEventListener('click', () => {
    setStoredApiKey('');
    elements.apiKeyInput.value = '';
    elements.wizardApiKey.value = '';
    updateApiBadge();
    showNotification("API key cleared. Switched to offline simulator.");
    elements.apiModal.classList.remove('active');
  });
}

function updateApiBadge() {
  const key = getStoredApiKey();
  if (key) {
    elements.apiStatusText.innerText = "AI Active";
    elements.btnApiConfig.classList.add('active');
  } else {
    elements.apiStatusText.innerText = "Simulator Mode";
    elements.btnApiConfig.classList.remove('active');
  }
}

// Wizard Pill Selections (Steps 1, 3)
function initPills() {
  setupPillGroup('energy-pills', 'selected-energy');
  setupPillGroup('diet-pills', 'selected-diet');
  setupPillGroup('goal-pills', 'selected-goal');
}

function setupPillGroup(groupId, hiddenId) {
  const container = document.getElementById(groupId);
  if (!container) return;
  const pills = container.querySelectorAll('.pill-option');
  const hidden = document.getElementById(hiddenId);

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      hidden.value = pill.getAttribute('data-value');
    });
  });
}

// Busy Slots List Handlers
function initBusySlots() {
  renderBusySlots();

  elements.btnAddSlot.addEventListener('click', () => {
    const label = elements.newSlotLabel.value.trim() || "Busy Slot";
    const start = elements.newSlotStart.value;
    const end = elements.newSlotEnd.value;

    if (!start || !end) {
      showNotification("Please select start and end times.");
      return;
    }

    if (start >= end) {
      showNotification("Start time must be before end time.");
      return;
    }

    appState.busySlots.push({ start, end, label });
    elements.newSlotLabel.value = '';
    renderBusySlots();
    showNotification(`Added slot: ${label}`);
  });
}

function renderBusySlots() {
  elements.busySlotsContainer.innerHTML = '';
  appState.busySlots.forEach((slot, index) => {
    const row = document.createElement('div');
    row.className = 'schedule-slot-item';
    row.innerHTML = `
      <div style="font-size: 0.85rem; font-weight:600; color: var(--text-main);">${slot.label}</div>
      <div style="font-size: 0.8rem; color: var(--accent-secondary);"><i data-lucide="clock" style="width: 12px; height:12px; display:inline-block; vertical-align:middle; margin-right:2px;"></i>${format12Hour(slot.start)}</div>
      <div style="font-size: 0.8rem; color: var(--accent-secondary);"><i data-lucide="arrow-right" style="width: 12px; height:12px; display:inline-block; vertical-align:middle; margin-right:2px;"></i>${format12Hour(slot.end)}</div>
      <button type="button" class="btn-remove" data-index="${index}"><i data-lucide="trash-2" style="width: 14px; height: 14px;"></i></button>
    `;
    
    // Bind delete button
    row.querySelector('.btn-remove').addEventListener('click', () => {
      appState.busySlots.splice(index, 1);
      renderBusySlots();
    });

    elements.busySlotsContainer.appendChild(row);
  });

  if (window.lucide) window.lucide.createIcons();
}

function format12Hour(time24) {
  const parts = time24.split(':');
  let hour = parseInt(parts[0]);
  const min = parts[1];
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${min} ${ampm}`;
}

// Multi-step Wizard Navigation
function initWizardNavigation() {
  elements.btnNext.addEventListener('click', () => {
    if (appState.activeStep < appState.totalSteps) {
      goToStep(appState.activeStep + 1);
    } else {
      generatePlan();
    }
  });

  elements.btnPrev.addEventListener('click', () => {
    if (appState.activeStep > 1) {
      goToStep(appState.activeStep - 1);
    }
  });

  elements.btnResetWizard.addEventListener('click', () => {
    elements.mainDashboard.classList.remove('active');
    elements.wizardPanel.classList.add('active');
    goToStep(1);
    showNotification("Reset. Modify settings and regenerate.");
  });
}

function goToStep(step) {
  // Update step class active
  elements.wizardSteps.forEach(el => el.classList.remove('active'));
  document.querySelector(`.wizard-step[data-step="${step}"]`).classList.add('active');

  // Update indicators
  elements.stepIndicators.forEach(ind => {
    const idx = parseInt(ind.getAttribute('data-step'));
    ind.classList.remove('active', 'completed');
    if (idx === step) {
      ind.classList.add('active');
    } else if (idx < step) {
      ind.classList.add('completed');
    }
  });

  appState.activeStep = step;

  // Buttons toggle
  elements.btnPrev.disabled = step === 1;
  if (step === appState.totalSteps) {
    elements.btnNext.innerHTML = `Generate Plan <i data-lucide="wand-2"></i>`;
  } else {
    elements.btnNext.innerHTML = `Next <i data-lucide="chevron-right"></i>`;
  }
  
  if (window.lucide) window.lucide.createIcons();
}

// Dynamic plan generation connector
async function generatePlan() {
  // Collect inputs
  const wakeTime = document.getElementById('wake-time').value;
  const sleepTime = document.getElementById('sleep-time').value;
  const energy = document.getElementById('selected-energy').value;
  const country = document.getElementById('country').value;
  const state = document.getElementById('state-region').value;
  const city = document.getElementById('city-location').value;
  const diet = document.getElementById('selected-diet').value;
  const goal = document.getElementById('selected-goal').value;
  const currency = document.getElementById('currency').value;
  const budget = parseFloat(document.getElementById('daily-budget').value) || 25;
  const people = parseInt(document.getElementById('people-count').value) || 1;
  const fridge = document.getElementById('fridge-ingredients').value;

  const data = {
    wakeTime, sleepTime, energy, country, state, city, diet, goal, currency, budget, people, fridge,
    busySlots: appState.busySlots
  };

  // Show Loading state
  elements.wizardPanel.classList.remove('active');
  elements.loadingOverlay.classList.add('active');

  // Simulate loader status texts
  const statusTexts = [
    "Analyzing schedule times and busy boundaries...",
    "Matching dietary restrictions with regional cuisine...",
    "Estimating local grocery list item prices...",
    "Balancing macro breakdown distributions...",
    "Checking budget feasibility and identifying substitutions..."
  ];

  let textIdx = 0;
  const statusInterval = setInterval(() => {
    if (textIdx < statusTexts.length) {
      elements.loadingStatus.innerText = statusTexts[textIdx++];
    }
  }, 400);

  const startTime = performance.now();
  try {
    const plan = await generateChefPlan(data);
    const latencySec = ((performance.now() - startTime) / 1000).toFixed(2);
    clearInterval(statusInterval);
    
    appState.currentPlan = plan;
    appState.appliedSwaps.clear();
    
    renderPlan(plan, data);

    // Update Developer Log Panel
    if (plan._debug) {
      elements.devPromptText.innerText = plan._debug.prompt;
      elements.devResponseJson.innerText = plan._debug.rawResponse;
      elements.devApiLatency.innerText = `${latencySec}s`;
      elements.devModelName.innerText = plan._debug.isRealCall ? "gemini-1.5-flash" : "Local Simulator (Offline)";
      elements.devApiStatus.innerText = plan._debug.isRealCall ? "Success (Real AI Call)" : "Success (Simulator Fallback)";
      elements.devApiStatus.style.color = plan._debug.isRealCall ? "var(--color-success)" : "var(--color-warning)";
      elements.devConsolePanel.style.display = 'block';
    } else {
      elements.devConsolePanel.style.display = 'none';
    }
    
    elements.loadingOverlay.classList.remove('active');
    elements.mainDashboard.classList.add('active');
    
    showNotification("ChefFlow plan prepared successfully!");
  } catch (error) {
    clearInterval(statusInterval);
    elements.loadingOverlay.classList.remove('active');
    elements.wizardPanel.classList.add('active');
    alert("Error: " + error.message + "\nPlease try checking your internet, your API Key, or retry in Simulator mode.");
  }
}

// Render generated outputs onto the Dashboard layout
function renderPlan(plan, rawInput) {
  renderTimeline(plan.timeline);
  renderMeals(plan.meals, rawInput.currency);
  renderBudgetFeasibility(plan.budgetFeasibility, rawInput.budget);
  renderSwaps(plan.suggestedSwaps, rawInput.currency);
  renderGroceryList(plan.meals, rawInput.currency);
}

// Renders the left-hand timeline column
function renderTimeline(timeline) {
  elements.timelineContainer.innerHTML = '';
  
  timeline.forEach((item, index) => {
    const node = document.createElement('div');
    node.className = `timeline-node`;
    node.id = `timeline-node-${index}`;
    
    let colorStyle = 'var(--accent-secondary)';
    let itemIcon = 'utensils';
    
    if (item.meal === 'breakfast') {
      itemIcon = 'coffee';
      colorStyle = 'var(--accent-primary)';
    } else if (item.meal === 'lunch') {
      itemIcon = 'sun';
      colorStyle = 'var(--accent-secondary)';
    } else if (item.meal === 'dinner') {
      itemIcon = 'moon';
      colorStyle = '#f59e0b';
    } else if (item.meal === 'prep') {
      itemIcon = 'flame';
      colorStyle = '#ec4899';
    }
    
    node.innerHTML = `
      <div class="timeline-dot" style="border-color: ${colorStyle}"></div>
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div class="timeline-action">${item.action}</div>
          <input type="checkbox" class="grocery-checkbox timeline-check" data-idx="${index}" style="margin-top: 2px;">
        </div>
        <div class="timeline-meta">
          <span><i data-lucide="hourglass" style="width: 10px; height: 10px; display: inline-block; vertical-align: middle; margin-right: 2px;"></i>${item.duration} mins</span>
          <span><i data-lucide="zap" style="width: 10px; height: 10px; display: inline-block; vertical-align: middle; margin-right: 2px;"></i>${item.energyRequirement} Energy</span>
        </div>
      </div>
    `;

    // Bind checklist cross-out
    const check = node.querySelector('.timeline-check');
    check.addEventListener('change', () => {
      if (check.checked) {
        node.classList.add('completed');
      } else {
        node.classList.remove('completed');
      }
    });

    // Bind click to scroll to corresponding meal block
    if (item.meal !== 'prep') {
      node.querySelector('.timeline-card').addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') return;
        const mealEl = document.getElementById(`meal-${item.meal}`);
        if (mealEl) {
          mealEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          mealEl.style.borderColor = 'var(--accent-primary)';
          setTimeout(() => {
            mealEl.style.borderColor = 'var(--border-color)';
          }, 1500);
          
          // Expand content if closed
          const exp = mealEl.querySelector('.meal-expanded-content');
          exp.classList.add('active');
        }
      });
    }

    elements.timelineContainer.appendChild(node);
  });
  
  if (window.lucide) window.lucide.createIcons();
}

// Renders the middle-column meal cards
function renderMeals(meals, currencySymbol = "$") {
  elements.mealsContainer.innerHTML = '';
  
  const mKeys = ['breakfast', 'lunch', 'dinner'];
  mKeys.forEach(mKey => {
    const meal = meals[mKey];
    const totalMacros = meal.macros.protein + meal.macros.carbs + meal.macros.fats;
    const proteinPct = Math.round((meal.macros.protein / totalMacros) * 100) || 30;
    const carbsPct = Math.round((meal.macros.carbs / totalMacros) * 100) || 45;
    const fatsPct = Math.round((meal.macros.fats / totalMacros) * 100) || 25;

    const card = document.createElement('div');
    card.className = 'meal-card';
    card.id = `meal-${mKey}`;
    
    let ingredientsHTML = '';
    meal.ingredients.forEach(ing => {
      ingredientsHTML += `
        <li class="recipe-ingredient-item">
          <span>${ing.name} <span style="font-size: 0.75rem; color:var(--text-muted);">(${ing.amount})</span></span>
          <span style="font-weight: 600;">${currencySymbol}${ing.cost.toFixed(2)}</span>
        </li>
      `;
    });

    let instructionsHTML = '';
    meal.instructions.forEach((step, stepIdx) => {
      // Look for timers in instructions (e.g. "cook for 10 minutes", "bake 15 mins")
      const timeMatch = step.match(/(\d+)\s*(minutes|mins|minute|min)/i);
      const timerBtn = timeMatch 
        ? `<button class="btn btn-secondary btn-step-timer" data-mins="${timeMatch[1]}" data-label="Step ${stepIdx+1} Timer" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; border-radius: 4px; display:inline-flex; align-items:center; gap:2px;"><i data-lucide="timer" style="width: 10px; height:10px;"></i>Start ${timeMatch[1]}m</button>`
        : '';

      instructionsHTML += `
        <div class="recipe-step">
          <span class="recipe-step-num">${stepIdx + 1}</span>
          <div>
            <div>${step}</div>
            ${timerBtn}
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="meal-card-header">
        <span class="meal-tag">${mKey}</span>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Energy: <strong>${meal.energyReq}</strong></span>
      </div>
      <div class="meal-card-body">
        <h3 class="meal-title">${meal.name}</h3>
        <div class="meal-stats">
          <div class="meal-stat"><i data-lucide="flame" style="width:14px; height:14px; color:#ef4444;"></i>${meal.calories} kcal</div>
          <div class="meal-stat"><i data-lucide="clock" style="width:14px; height:14px; color:var(--accent-secondary);"></i>${meal.prepTime + meal.cookTime} mins</div>
        </div>

        <div class="macros-gauge">
          <div class="macros-gauge-header">
            <span>Macros Breakdown</span>
            <span>Prot: ${meal.macros.protein}g | Carb: ${meal.macros.carbs}g | Fat: ${meal.macros.fats}g</span>
          </div>
          <div class="macros-bar">
            <div class="macro-segment protein" style="width: ${proteinPct}%;" title="Protein: ${proteinPct}%"></div>
            <div class="macro-segment carbs" style="width: ${carbsPct}%;" title="Carbs: ${carbsPct}%"></div>
            <div class="macro-segment fats" style="width: ${fatsPct}%;" title="Fats: ${fatsPct}%"></div>
          </div>
          <div class="macros-labels">
            <div class="macro-label-item"><div class="macro-dot protein"></div> Protein (${proteinPct}%)</div>
            <div class="macro-label-item"><div class="macro-dot carbs"></div> Carbs (${carbsPct}%)</div>
            <div class="macro-label-item"><div class="macro-dot fats"></div> Fats (${fatsPct}%)</div>
          </div>
        </div>

        <div class="meal-expansion-trigger" data-target="expand-${mKey}">
          <span>View Ingredients & Recipe Steps</span> <i data-lucide="chevron-down" style="width: 14px; height:14px;"></i>
        </div>

        <div class="meal-expanded-content" id="expand-${mKey}">
          <div class="recipe-subtitle">Required Ingredients</div>
          <ul class="recipe-ingredients-list">
            ${ingredientsHTML}
          </ul>
          
          <div class="recipe-subtitle" style="margin-bottom: 0.75rem;">Preparation Method</div>
          <div class="recipe-instructions">
            ${instructionsHTML}
          </div>
        </div>
      </div>
    `;

    // Expander logic
    const trigger = card.querySelector('.meal-expansion-trigger');
    const expanded = card.querySelector('.meal-expanded-content');
    trigger.addEventListener('click', () => {
      expanded.classList.toggle('active');
      const icon = trigger.querySelector('[data-lucide]');
      if (expanded.classList.contains('active')) {
        trigger.querySelector('span').innerText = 'Hide Ingredients & Recipe Steps';
        icon.style.transform = 'rotate(180deg)';
      } else {
        trigger.querySelector('span').innerText = 'View Ingredients & Recipe Steps';
        icon.style.transform = 'rotate(0deg)';
      }
    });

    // Step Timer binder
    card.querySelectorAll('.btn-step-timer').forEach(btn => {
      btn.addEventListener('click', () => {
        const mins = parseInt(btn.getAttribute('data-mins'));
        const label = btn.getAttribute('data-label');
        startCookingTimer(mins, label);
      });
    });

    elements.mealsContainer.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
}

// Renders the budget stats panel
function renderBudgetFeasibility(feasibility, limitAmount) {
  elements.budgetLimitText.innerText = `${feasibility.currencySymbol}${limitAmount.toFixed(2)}`;
  elements.budgetCostText.innerText = `${feasibility.currencySymbol}${feasibility.totalEstimatedCost.toFixed(2)}`;
  
  const pct = Math.min((feasibility.totalEstimatedCost / limitAmount) * 100, 100);
  elements.budgetProgressBar.style.width = `${pct}%`;
  
  // Dynamic color coding
  elements.budgetProgressBar.className = 'budget-bar-inner';
  elements.budgetMessageBox.className = 'budget-alert-message';
  elements.budgetGlow.className = 'budget-widget-glow';
  
  if (feasibility.totalEstimatedCost <= limitAmount) {
    if (pct > 80) {
      elements.budgetProgressBar.classList.add('warning');
      elements.budgetMessageBox.classList.add('warning');
      elements.budgetMessageBox.style.color = '#fef08a';
      elements.budgetMessageBox.style.borderColor = 'rgba(245, 158, 11, 0.2)';
    } else {
      elements.budgetProgressBar.classList.add('feasible');
      elements.budgetMessageBox.classList.add('feasible');
    }
    elements.budgetGlow.classList.add('feasible');
  } else {
    elements.budgetProgressBar.classList.add('over');
    elements.budgetMessageBox.classList.add('unfeasible');
    elements.budgetGlow.classList.add('unfeasible');
  }

  elements.budgetMessageBox.innerText = feasibility.message;
}

// Renders the Substitution Swaps Widget
function renderSwaps(swaps, currencySymbol = "$") {
  elements.swapsList.innerHTML = '';
  
  if (!swaps || swaps.length === 0) {
    elements.swapsContainer.style.display = 'none';
    return;
  }
  
  elements.swapsContainer.style.display = 'block';
  
  swaps.forEach((swap, index) => {
    const isApplied = appState.appliedSwaps.has(index);
    const card = document.createElement('div');
    card.className = 'swap-item-card';
    card.innerHTML = `
      <div class="swap-card-top">
        <div class="swap-labels">
          <span class="swap-label-original">${swap.originalItem}</span>
          <span class="swap-label-arrow"><i data-lucide="arrow-right" style="width: 10px; height: 10px; display:inline-block; vertical-align:middle;"></i></span>
          <span class="swap-label-new">${swap.suggestedItem}</span>
        </div>
        <div class="swap-savings-badge">Save ${currencySymbol}${swap.savings.toFixed(2)}</div>
      </div>
      <div class="swap-reason">${swap.reason}</div>
      <div class="swap-action-container">
        <button class="btn-swap ${isApplied ? 'swapped' : ''}" data-idx="${index}" ${isApplied ? 'disabled' : ''}>
          ${isApplied ? 'Swapped' : 'Apply Swap'}
        </button>
      </div>
    `;

    // Swap execute trigger
    const swapBtn = card.querySelector('.btn-swap');
    if (!isApplied) {
      swapBtn.addEventListener('click', () => {
        applySwap(swap, index);
      });
    }

    elements.swapsList.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
}

// Renders the right-hand grocery checklist
function renderGroceryList(meals, currencySymbol = "$") {
  elements.groceryAislesContainer.innerHTML = '';
  
  // Gather and group ingredients
  const aisles = {};
  const mKeys = ['breakfast', 'lunch', 'dinner'];
  
  mKeys.forEach(mKey => {
    meals[mKey].ingredients.forEach(ing => {
      const category = ing.category || "Pantry";
      if (!aisles[category]) aisles[category] = [];
      
      // Check if item is already added to avoid duplicates, combine amount
      const existing = aisles[category].find(x => x.name.toLowerCase() === ing.name.toLowerCase());
      if (existing) {
        existing.amount += `, ${ing.amount}`;
        existing.cost += ing.cost;
      } else {
        aisles[category].push({
          name: ing.name,
          amount: ing.amount,
          cost: ing.cost,
          mealKey: mKey
        });
      }
    });
  });

  // Render grouped items
  Object.keys(aisles).forEach(aisleName => {
    const title = document.createElement('div');
    title.className = 'grocery-aisle-title';
    title.innerText = aisleName;
    
    const container = document.createElement('div');
    container.className = 'grocery-items-container';
    
    aisles[aisleName].forEach(item => {
      const row = document.createElement('div');
      row.className = 'grocery-item-row';
      row.innerHTML = `
        <div class="grocery-item-left">
          <input type="checkbox" class="grocery-checkbox">
          <span class="grocery-item-name">${item.name}</span>
          <span class="grocery-item-qty">${item.amount}</span>
        </div>
        <div class="grocery-item-right">
          <span style="font-size:0.75rem; color:var(--text-muted);">${currencySymbol}</span>
          <input type="number" class="grocery-item-price-input" value="${item.cost.toFixed(2)}" step="0.10" min="0" data-meal="${item.mealKey}" data-name="${item.name}">
        </div>
      `;
      
      // Bind checkbox strikethrough
      const check = row.querySelector('.grocery-checkbox');
      const nameSpan = row.querySelector('.grocery-item-name');
      check.addEventListener('change', () => {
        if (check.checked) {
          nameSpan.style.textDecoration = 'line-through';
          nameSpan.style.color = 'var(--text-muted)';
        } else {
          nameSpan.style.textDecoration = 'none';
          nameSpan.style.color = 'var(--text-main)';
        }
      });

      // Bind input price updates to recalculate the budget real-time!
      const priceInput = row.querySelector('.grocery-item-price-input');
      priceInput.addEventListener('input', () => {
        updateIngredientPriceInState(item.mealKey, item.name, parseFloat(priceInput.value) || 0);
      });

      container.appendChild(row);
    });

    elements.groceryAislesContainer.appendChild(title);
    elements.groceryAislesContainer.appendChild(container);
  });
}

// When a user updates price in grocery checklist, recalulate entire plan budget
function updateIngredientPriceInState(mealKey, ingredientName, newCost) {
  const plan = appState.currentPlan;
  if (!plan) return;
  
  // Find in meals
  let found = false;
  plan.meals[mealKey].ingredients.forEach(ing => {
    if (ing.name.toLowerCase() === ingredientName.toLowerCase()) {
      ing.cost = newCost;
      found = true;
    }
  });

  // Re-tally budget total cost
  recalculateTotalBudget();
}

function recalculateTotalBudget() {
  const plan = appState.currentPlan;
  if (!plan) return;
  
  let newTotal = 0;
  const mKeys = ['breakfast', 'lunch', 'dinner'];
  mKeys.forEach(m => {
    plan.meals[m].ingredients.forEach(i => {
      newTotal += (i.cost || 0);
    });
  });

  plan.budgetFeasibility.totalEstimatedCost = parseFloat(newTotal.toFixed(2));
  
  const limitInput = parseFloat(document.getElementById('daily-budget').value) || 25;
  const isFeasible = newTotal <= limitInput;
  plan.budgetFeasibility.isFeasible = isFeasible;
  
  if (isFeasible) {
    plan.budgetFeasibility.message = `Perfect! Recalculated cost (${plan.budgetFeasibility.currencySymbol}${newTotal.toFixed(2)}) is within budget.`;
  } else {
    plan.budgetFeasibility.message = `Attention: Recalculated cost (${plan.budgetFeasibility.currencySymbol}${newTotal.toFixed(2)}) exceeds budget. Consider swaps.`;
  }

  renderBudgetFeasibility(plan.budgetFeasibility, limitInput);
}

// Executes Substitution Swaps
function applySwap(swap, swapIndex) {
  const plan = appState.currentPlan;
  if (!plan) return;

  const mealKey = swap.mealAffected;
  const original = swap.originalItem;
  const replacement = swap.suggestedItem;
  const savings = swap.savings;

  // 1. Swap ingredient in recipes
  let swappedInMeal = false;
  plan.meals[mealKey].ingredients.forEach(ing => {
    if (ing.name.toLowerCase() === original.toLowerCase()) {
      ing.name = replacement;
      ing.cost = Math.max(0, ing.cost - savings);
      ing.replaceable = false; // Cannot swap again
      swappedInMeal = true;
    }
  });

  if (swappedInMeal) {
    // 2. Also rename ingredient occurrences in instructions if mentioned
    plan.meals[mealKey].instructions = plan.meals[mealKey].instructions.map(inst => {
      return inst.replace(new RegExp(original, 'gi'), replacement);
    });

    // 3. Mark swap as applied
    appState.appliedSwaps.add(swapIndex);
    showNotification(`Swapped: ${original} → ${replacement}!`);

    // 4. Re-draw components
    renderMeals(plan.meals, plan.budgetFeasibility.currencySymbol);
    recalculateTotalBudget();
    renderSwaps(plan.suggestedSwaps, plan.budgetFeasibility.currencySymbol);
    renderGroceryList(plan.meals, plan.budgetFeasibility.currencySymbol);
  }
}

// Kitchen cooking timeline active step timer
function initTimerWidget() {
  elements.btnCloseTimer.addEventListener('click', () => {
    stopCookingTimer();
  });
}

function startCookingTimer(minutes, label) {
  stopCookingTimer(); // Clear old ones

  elements.timerLabel.innerText = label || "Step Timer";
  elements.timerWidget.style.display = 'flex';
  
  let secondsRemaining = minutes * 60;
  
  const updateDisplay = () => {
    const minStr = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
    const secStr = (secondsRemaining % 60).toString().padStart(2, '0');
    elements.timerDisplay.innerText = `${minStr}:${secStr}`;
  };

  updateDisplay();

  appState.activeTimerInterval = setInterval(() => {
    secondsRemaining--;
    if (secondsRemaining <= 0) {
      clearInterval(appState.activeTimerInterval);
      elements.timerDisplay.innerText = "00:00";
      // Ring sound / flash UI
      playTimerEndEffect();
    } else {
      updateDisplay();
    }
  }, 1000);
  
  showNotification(`Cooking timer started for ${minutes} mins!`);
}

function stopCookingTimer() {
  if (appState.activeTimerInterval) {
    clearInterval(appState.activeTimerInterval);
    appState.activeTimerInterval = null;
  }
  elements.timerWidget.style.display = 'none';
}

function playTimerEndEffect() {
  let flashes = 5;
  const flash = setInterval(() => {
    elements.timerWidget.style.borderColor = flashes % 2 === 0 ? 'var(--accent-secondary)' : 'var(--color-danger)';
    elements.timerWidget.style.boxShadow = flashes % 2 === 0 ? '0 4px 20px rgba(6, 182, 212, 0.2)' : '0 4px 20px rgba(239, 68, 68, 0.4)';
    flashes--;
    if (flashes < 0) {
      clearInterval(flash);
      elements.timerWidget.style.borderColor = 'var(--accent-secondary)';
      elements.timerWidget.style.boxShadow = '0 4px 20px rgba(6, 182, 212, 0.2)';
    }
  }, 300);

  // Audio chirp (using standard browser AudioContext so no files are needed!)
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.log("Audio play blocked by browser policies.");
  }
}

// Simple floating toast notifications
function showNotification(message) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'rgba(10, 15, 22, 0.95)';
  toast.style.border = '1px solid var(--accent-primary)';
  toast.style.color = '#fff';
  toast.style.padding = '0.75rem 1.5rem';
  toast.style.borderRadius = '30px';
  toast.style.fontSize = '0.85rem';
  toast.style.fontWeight = '600';
  toast.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.2)';
  toast.style.zIndex = '9999';
  toast.style.animation = 'scaleUp 0.2s ease';
  
  toast.innerText = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.2s reverse ease';
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, 2500);
}
