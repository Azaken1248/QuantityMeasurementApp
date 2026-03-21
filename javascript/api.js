const BASE_URL = "https://api.measurement.azaken.com";


export async function getUnits(type) {
  const res = await fetch(`${BASE_URL}/units?type=${type}`);
  
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch units for type "${type}"`);
  }
  
  return await res.json();
}

export async function getConversion(from, to) {
  if (from === to) {
    return { from, to, factor: 1, formula: "1:1" };
  }

  const res = await fetch(`${BASE_URL}/conversions?from=${from}&to=${to}`);
  
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch conversion for "${from}" to "${to}"`);
  }

  const data = await res.json();
  
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`Conversion not available for unit pair "${from}" → "${to}"`);
  }
  
  return data[0];
}

export async function saveHistory(record) {
  try {
    const res = await fetch(`${BASE_URL}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    });

    if (!res.ok) {
      console.error(`[History] HTTP ${res.status} - Failed to save history`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("[History] Error saving calculation record:", error.message);
    return null;
  }
}

export async function getHistory() {
  try {
    const res = await fetch(`${BASE_URL}/history?_sort=timestamp&_order=desc`);

    if (!res.ok) {
      console.error(`[History] HTTP ${res.status} - Failed to fetch history`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[History] Network error fetching calculation records:", error.message);
    return [];
  }
}

export function applyConversion(value, convObj) {
  if (isNaN(value)) {
    throw new Error("Invalid number");
  }

  if (convObj.factor !== null && convObj.factor !== undefined) {
    const result = value * convObj.factor;
    return parseFloat(result.toFixed(6));
  }

  if (convObj.formula) {
    try {
      const expr = convObj.formula.replace(/x/g, value);
      const result = eval(expr);
      return parseFloat(result.toFixed(6));
    } catch (error) {
      throw new Error(`Bad formula: ${error.message}`);
    }
  }

  throw new Error("No conversion factor or formula provided");
}

export function compareValues(v1, u1, v2, u2, base1, base2) {
  if (isNaN(v1) || isNaN(v2) || isNaN(base1) || isNaN(base2)) {
    return "Invalid values — cannot compare";
  }

  if (base1 > base2) {
    return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
  }

  if (base1 < base2) {
    return `${v1} ${u1} is LESS than ${v2} ${u2}`;
  }

  return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
}


export function performArithmetic(v1, v2normalised, op) {
  if (isNaN(v1) || isNaN(v2normalised)) {
    throw new Error("Invalid number");
  }

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

    default:
      throw new Error(`Unknown operator: "${op}"`);
  }
}