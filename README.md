# QuantityMeasurementApp

A web-based quantity measurement system featuring conversion, comparison, and arithmetic operations across multiple unit types with a modern UI and powerful search capabilities.

## [Use Case 1](https://github.com/Azaken1248/QuantityMeasurementApp/tree/feature/UC1-QuantityMeasurementApp)

To load and populate measurement types (Length, Weight, Temperature, Volume) with available units.

#### key concept

(1) Async API integration to fetch unit metadata ([api.js](javascript/api.js))

```javascript
export async function getUnits(type) {
  const res = await fetch(`${BASE_URL}/units?type=${type}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch units for type "${type}"`);
  }
  return await res.json();
}
```

(2) Dynamic dropdown population with validated units ([ui.js](javascript/ui.js))

```javascript
export function populateDropdown(selectEl, units) {
  selectEl.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = "-- Select Unit --";
  selectEl.appendChild(defaultOption);
  
  units.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u.symbol;
    opt.textContent = `${u.label} (${u.symbol})`;
    selectEl.appendChild(opt);
  });
}
```

## [Use Case 2-6](https://github.com/Azaken1248/QuantityMeasurementApp/tree/feature/UC6-QuantityMeasurementApp)

To manage UI state and event orchestration across type/action selections.

#### key concept

(1) State management through centralized object ([script.js](javascript/script.js))

```javascript
const state = {
  type: "length",
  action: "conversion",
  fromVal: null,
  fromUnit: "",
  toVal: null,
  toUnit: "",
  operator: "+"
};
```

(2) Event delegation with data attributes for dynamic routing ([app.js](javascript/app.js))

```javascript
export function handleTypeCardClick(state, showErrorBanner) {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", async () => {
      const selectedType = card.dataset.type;
      state.type = selectedType;
      // load units and reset form
    });
  });
}
```

## [Use Case 7](https://github.com/Azaken1248/QuantityMeasurementApp/tree/feature/UC7-QuantityMeasurementApp)

To apply conversion formulas using factor multiplication or mathematical expressions.

#### key concept

(1) Dual-mode conversion supporting both linear factors and complex formulas ([conversion.js](javascript/conversion.js))

```javascript
export function applyConversion(value, convObj) {
  if (convObj.factor !== null && convObj.factor !== undefined) {
    const result = value * convObj.factor;
    return parseFloat(result.toFixed(6));
  }
  if (convObj.formula) {
    const expr = convObj.formula.replace(/x/g, value);
    const result = eval(expr);
    return parseFloat(result.toFixed(6));
  }
  throw new Error("No conversion factor or formula provided");
}
```

(2) Precision management with fixed decimal places for consistency

```javascript
return parseFloat(result.toFixed(6)); // Standardized to 6 decimals
```

## [Use Case 8](https://github.com/Azaken1248/QuantityMeasurementApp/tree/feature/UC8-QuantityMeasurementApp)

To compare two quantities and determine their relational equality.

#### key concept

(1) Unit normalization to common base before comparison ([conversion.js](javascript/conversion.js))

```javascript
export function compareValues(v1, u1, v2, u2, base1, base2) {
  if (base1 > base2) {
    return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
  }
  if (base1 < base2) {
    return `${v1} ${u1} is LESS than ${v2} ${u2}`;
  }
  return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
}
```

(2) Dynamic comparison query execution ([app.js](javascript/app.js))

```javascript
const conv = await getConversion(state.fromUnit, state.toUnit);
const base1 = applyConversion(state.fromVal, conv);
const base2 = state.toVal;
const result = compareValues(state.fromVal, state.fromUnit, state.toVal, state.toUnit, base1, base2);
```

## [Use Case 9](https://github.com/Azaken1248/QuantityMeasurementApp/tree/feature/UC9-QuantityMeasurementApp)

To perform arithmetic operations across different unit scales.

#### key concept

(1) Operator pattern with validation for safe computation ([conversion.js](javascript/conversion.js))

```javascript
export function performArithmetic(v1, v2normalised, op) {
  switch (op) {
    case "+":
      return parseFloat((v1 + v2normalised).toFixed(6));
    case "-":
      return parseFloat((v1 - v2normalised).toFixed(6));
    case "*":
      return parseFloat((v1 * v2normalised).toFixed(6));
    case "/":
      if (v2normalised === 0) {
        throw new Error("Cannot divide by zero");
      }
      return parseFloat((v1 / v2normalised).toFixed(6));
  }
}
```

(2) Unit normalization before arithmetic execution

```javascript
const convToFrom = await getConversion(state.toUnit, state.fromUnit);
const normalizedToVal = applyConversion(state.toVal, convToFrom);
const result = performArithmetic(state.fromVal, normalizedToVal, state.operator);
```

## [Use Case 10](https://github.com/Azaken1248/QuantityMeasurementApp/tree/feature/UC10-QuantityMeasurementApp)

To populate UI dropdowns with unit options and manage selection state.

#### key concept

(1) Active state management for visual feedback ([ui.js](javascript/ui.js))

```javascript
export function setActive(parentEl, clickedEl, childSelector) {
  parentEl.querySelectorAll(childSelector).forEach(el => el.classList.remove("active"));
  clickedEl.classList.add("active");
}
```

(2) Conditional visibility toggling for mode-specific UI ([ui.js](javascript/ui.js))

```javascript
export function toggleOperators(show) {
  const operatorSelector = document.querySelector(".operator-row");
  operatorSelector.style.display = show ? "flex" : "none";
}
```

## [Use Case 11](https://github.com/Azaken1248/QuantityMeasurementApp/tree/feature/UC11-QuantityMeasurementApp)

To display calculation results with visual emphasis and type-specific formatting.

#### key concept

(1) DOM-based result rendering with animation feedback ([ui.js](javascript/ui.js))

```javascript
export function showResult(value, unitSymbol) {
  const resultContainer = document.querySelector(".result-container");
  const resultValueEl = document.querySelector("#result-value");
  const resultUnitEl = document.querySelector("#result-unit");
  
  resultValueEl.textContent = value;
  resultUnitEl.textContent = unitSymbol || "";
  
  const resultPanel = resultValueEl?.parentElement;
  if (resultPanel) {
    resultPanel.classList.add("highlight");
    setTimeout(() => resultPanel.classList.remove("highlight"), 1500);
  }
}
```

## [Use Case 12](https://github.com/Azaken1248/QuantityMeasurementApp/tree/feature/UC12-QuantityMeasurementApp)

To render calculation history with timestamps and persistent search filtering.

#### key concept

(1) Timestamp formatting with date/time separation ([ui.js](javascript/ui.js))

```javascript
export function renderHistory(records) {
  records.forEach(r => {
    const li = document.createElement("li");
    const date = new Date(r.timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    li.textContent = `${r.expression} = ${r.result}\n${dateStr} ${timeStr}`;
    list.appendChild(li);
  });
}
```

(2) Real-time search filtering with case-insensitive matching ([ui.js](javascript/ui.js))

```javascript
export function attachHistorySearch(records) {
  const searchInput = document.querySelector("#history-search");
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const items = historyList.querySelectorAll("li");
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? "block" : "none";
    });
  });
}
```

## [Use Case 13-14](https://github.com/Azaken1248/QuantityMeasurementApp/tree/feature/UC14-QuantityMeasurementApp)

To persist calculation history to backend and retrieve on application load.

#### key concept

(1) Persistent storage with JSON serialization ([api.js](javascript/api.js))

```javascript
export async function saveHistory(record) {
  const res = await fetch(`${BASE_URL}/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record)
  });
  return await res.json();
}
```

(2) Retroactive history loading with fallback caching ([script.js](javascript/script.js))

```javascript
async function loadHistory() {
  try {
    const historyPayload = await getHistory();
    cachedHistory = Array.isArray(historyPayload) ? historyPayload : historyPayload?.history || [];
  } catch (_) {
    cachedHistory = cachedHistory || [];
  }
  renderHistory(cachedHistory);
}
```

## [Use Case 15-17](https://github.com/Azaken1248/QuantityMeasurementApp/tree/feature/UC17-QuantityMeasurementApp)

To orchestrate complete calculation workflow with mode-aware result display and validation.

#### key concept

(1) Mode-dependent behavior with conditional logic routing ([app.js](javascript/app.js))

```javascript
export async function calculate(state, showErrorBanner) {
  if (state.action === "conversion") {
    const conv = await getConversion(state.fromUnit, state.toUnit);
    const result = applyConversion(state.fromVal, conv);
    const toInput = document.querySelectorAll(".input-container .input-field")[1];
    toInput.value = result;
    resultContainer.style.display = "none";
  }
  else if (state.action === "comparison") {
    // comparison logic with result panel display
  }
  else if (state.action === "arithmetic") {
    // arithmetic logic with normalized conversion
  }
}
```

(2) Comprehensive input validation with early exit patterns

```javascript
if (!state.fromVal || state.fromVal <= 0 || !state.fromUnit || !state.toUnit) {
  resultContainer.style.display = "none";
  return;
}
```

(3) Context-aware UI state management ([app.js](javascript/app.js))

```javascript
if (state.action === "conversion") {
  toInput.readOnly = true;
  toInput.style.backgroundColor = "#45475a";
} else {
  toInput.readOnly = false;
  toInput.style.backgroundColor = "transparent";
}
```

(4) Mode-conditional history persistence

```javascript
if (state.action !== "conversion") {
  await saveHistory(record);
  const historyItems = await getHistory();
  renderHistory(historyItems);
}
```

## Architecture

**Modular Design:**
- `api.js` - Async HTTP communication layer
- `conversion.js` - Pure calculation functions (Factor/Formula, Comparison, Arithmetic)
- `ui.js` - DOM manipulation and display utilities
- `app.js` - Orchestration and handler logic
- `script.js` - State management and initialization

**Key Features:**
- Real-time calculation with multi-mode support
- Scrollbar-less sidebar with searchable history
- Open Graph metadata for social sharing embeds
- Responsive layout (Header + Content left, History sidebar right)
- Catppuccin Mocha color scheme
- Error handling with user-facing banners

## Integration Pipeline

Each feature is developed on a separate branch and after testing it is moved to [dev](https://github.com/Azaken1248/QuantityMeasurementApp/tree/dev)

after which it is finally released to [main](https://github.com/Azaken1248/QuantityMeasurementApp)

the feature branches for this repo follow the pattern: **feature/UC<number>-QuantityMeasurementApp**
