import { beforeEach, describe, expect, it } from "@jest/globals";
import { populateDropdown, toggleOperators, setActive } from "../javascript/ui.js";

describe("ui helpers", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("populateDropdown adds default option and provided units", () => {
    document.body.innerHTML = '<select id="unit"></select>';
    const select = document.querySelector("#unit");

    populateDropdown(select, [
      { label: "meter", symbol: "m" },
      { label: "centimeter", symbol: "cm" }
    ]);

    expect(select.options).toHaveLength(3);
    expect(select.options[0].textContent).toBe("-- Select Unit --");
    expect(select.options[1].value).toBe("m");
    expect(select.options[2].value).toBe("cm");
  });

  it("toggleOperators shows and hides operator row", () => {
    document.body.innerHTML = '<div class="operator-row" style="display:none"></div>';
    const row = document.querySelector(".operator-row");

    toggleOperators(true);
    expect(row.style.display).toBe("flex");

    toggleOperators(false);
    expect(row.style.display).toBe("none");
  });

  it("setActive toggles active class across sibling elements", () => {
    document.body.innerHTML = `
      <div id="parent">
        <button class="action-btn active" id="a">A</button>
        <button class="action-btn" id="b">B</button>
      </div>
    `;

    const parent = document.querySelector("#parent");
    const clicked = document.querySelector("#b");

    setActive(parent, clicked, ".action-btn");

    expect(document.querySelector("#a").classList.contains("active")).toBe(false);
    expect(document.querySelector("#b").classList.contains("active")).toBe(true);
  });
});
