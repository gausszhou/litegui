/** Right-hand panes: Format Chart Area and PivotTable Fields. */

import { icon } from "./icons";
import type { ChartSpec, PivotConfig, PivotValue, Sheet } from "./model";
import { PIVOT_AGG_LABELS } from "./pivot";

export interface ChartPaneCallbacks {
  onChange: (patch: Partial<ChartSpec>) => void;
  onClose: () => void;
}

export function renderChartPane(chart: ChartSpec, callbacks: ChartPaneCallbacks): HTMLElement {
  const root = document.createElement("section");
  root.className = "gc-pane gc-pane--chart";
  root.innerHTML = `
    <header class="gc-pane-head">
      <h2>Format Chart Area</h2>
      <button class="gc-icon-btn" type="button" data-pane-close title="Close">${icon("close", 14)}</button>
    </header>
    <div class="gc-pane-scroll">
      <details class="gc-pane-section" open>
        <summary>Chart Title</summary>
        <div class="gc-pane-content">
          <label class="gc-field gc-field--inline"><input type="checkbox" data-chart-show-title ${
            chart.title.trim() ? "checked" : ""
          }/> Show chart title</label>
          <input class="gc-input" data-chart-title value="${escapeAttr(chart.title)}" placeholder="Chart title" />
        </div>
      </details>
      <details class="gc-pane-section" open>
        <summary>Chart Type</summary>
        <div class="gc-pane-content">
          <select class="gc-input" data-chart-type>
            ${["column", "bar", "line", "area", "pie", "doughnut", "scatter"]
              .map(
                type =>
                  `<option value="${type}"${chart.type === type ? " selected" : ""}>${
                    type[0].toUpperCase() + type.slice(1)
                  }</option>`
              )
              .join("")}
          </select>
        </div>
      </details>
      <details class="gc-pane-section" open>
        <summary>Legend</summary>
        <div class="gc-pane-content">
          <select class="gc-input" data-chart-legend>
            ${(["right", "bottom", "top", "none"] as const)
              .map(
                position =>
                  `<option value="${position}"${chart.legend === position ? " selected" : ""}>${
                    position[0].toUpperCase() + position.slice(1)
                  }</option>`
              )
              .join("")}
          </select>
        </div>
      </details>
      <details class="gc-pane-section">
        <summary>Elements</summary>
        <div class="gc-pane-content">
          <label class="gc-field gc-field--inline"><input type="checkbox" data-chart-labels ${
            chart.dataLabels ? "checked" : ""
          }/> Data labels</label>
          <label class="gc-field gc-field--inline"><input type="checkbox" data-chart-gridlines ${
            chart.gridlines ? "checked" : ""
          }/> Gridlines</label>
        </div>
      </details>
      <details class="gc-pane-section">
        <summary>Colors &amp; Layout</summary>
        <div class="gc-pane-content">
          <div class="gc-palette-row">
            ${["office", "teal", "warm", "cool", "vivid"]
              .map(
                palette =>
                  `<button class="gc-palette-btn${
                    chart.palette === palette ? " is-active" : ""
                  }" type="button" data-chart-palette="${palette}" title="${palette}"><span data-pal="${palette}"></span></button>`
              )
              .join("")}
          </div>
          <div class="gc-size-row">
            <label class="gc-field gc-field--inline">Width <input class="gc-input gc-input--num" type="number" data-chart-width value="${Math.round(
              chart.w
            )}" min="200" max="1200" /></label>
            <label class="gc-field gc-field--inline">Height <input class="gc-input gc-input--num" type="number" data-chart-height value="${Math.round(
              chart.h
            )}" min="140" max="900" /></label>
          </div>
        </div>
      </details>
    </div>
  `;
  root.querySelector("[data-pane-close]")?.addEventListener("click", callbacks.onClose);
  const titleInput = root.querySelector<HTMLInputElement>("[data-chart-title]");
  titleInput?.addEventListener("input", () => callbacks.onChange({ title: titleInput.value }));
  root.querySelector<HTMLInputElement>("[data-chart-show-title]")?.addEventListener("change", event => {
    const checked = (event.target as HTMLInputElement).checked;
    callbacks.onChange({ title: checked ? titleInput?.value || "Chart Title" : "" });
    if (titleInput) titleInput.disabled = !checked;
  });
  root.querySelector<HTMLSelectElement>("[data-chart-type]")?.addEventListener("change", event => {
    callbacks.onChange({ type: (event.target as HTMLSelectElement).value as ChartSpec["type"] });
  });
  root.querySelector<HTMLSelectElement>("[data-chart-legend]")?.addEventListener("change", event => {
    callbacks.onChange({ legend: (event.target as HTMLSelectElement).value as ChartSpec["legend"] });
  });
  root.querySelector<HTMLInputElement>("[data-chart-labels]")?.addEventListener("change", event => {
    callbacks.onChange({ dataLabels: (event.target as HTMLInputElement).checked });
  });
  root.querySelector<HTMLInputElement>("[data-chart-gridlines]")?.addEventListener("change", event => {
    callbacks.onChange({ gridlines: (event.target as HTMLInputElement).checked });
  });
  root.querySelectorAll<HTMLElement>("[data-chart-palette]").forEach(button => {
    const palette = button.dataset.chartPalette ?? "office";
    const target = button.querySelector<HTMLElement>("[data-pal]");
    if (target) target.innerHTML = paletteDots(palette);
    button.addEventListener("click", () => {
      root.querySelectorAll(".gc-palette-btn").forEach(element => element.classList.remove("is-active"));
      button.classList.add("is-active");
      callbacks.onChange({ palette });
    });
  });
  const widthInput = root.querySelector<HTMLInputElement>("[data-chart-width]");
  widthInput?.addEventListener("change", () => callbacks.onChange({ w: Number(widthInput.value) }));
  const heightInput = root.querySelector<HTMLInputElement>("[data-chart-height]");
  heightInput?.addEventListener("change", () => callbacks.onChange({ h: Number(heightInput.value) }));
  return root;
}

function paletteDots(palette: string): string {
  const colors: Record<string, string[]> = {
    office: ["#4472c4", "#ed7d31", "#a5a5a5"],
    teal: ["#0e6b5c", "#3f9c8a", "#7cbcae"],
    warm: ["#c55a11", "#ed7d31", "#ffc000"],
    cool: ["#2f5597", "#4472c4", "#5b9bd5"],
    vivid: ["#264478", "#70ad47", "#ed7d31"]
  };
  return (colors[palette] ?? colors.office).map(color => `<i style="background:${color}"></i>`).join("");
}

export interface PivotPaneCallbacks {
  onFieldToggle: (field: string, checked: boolean) => void;
  onDropField: (area: PivotArea, field: string) => void;
  onChipMenu: (area: PivotArea, field: string, anchor: HTMLElement, value?: PivotValue) => void;
  onRefresh: () => void;
  onLayout: (anchor: HTMLElement) => void;
  onClose: () => void;
}

export type PivotArea = "filters" | "cols" | "rows" | "values";

const AREA_LABELS: Record<PivotArea, string> = {
  filters: "Filters",
  cols: "Columns",
  rows: "Rows",
  values: "Values"
};

export function renderPivotPane(sheet: Sheet, fields: string[], callbacks: PivotPaneCallbacks): HTMLElement {
  const config = sheet.pivot;
  const root = document.createElement("section");
  root.className = "gc-pane gc-pane--pivot";
  if (!config) return root;
  const memberships = new Map<string, PivotArea>();
  for (const field of config.rows) memberships.set(field, "rows");
  for (const field of config.cols) memberships.set(field, "cols");
  for (const field of Object.keys(config.filters)) memberships.set(field, "filters");
  for (const value of config.values) memberships.set(value.field, "values");

  const areaMarkup = (area: PivotArea): string => {
    let chips: string;
    if (area === "filters") {
      chips = Object.entries(config.filters)
        .map(([field, filter]) => chip(field, area, filter && filter !== "(All)" ? filter : undefined))
        .join("");
    } else if (area === "cols") {
      chips = config.cols.map(field => chip(field, area)).join("");
    } else if (area === "rows") {
      chips = config.rows.map(field => chip(field, area)).join("");
    } else {
      chips = config.values
        .map(value => chip(value.field, area, `${PIVOT_AGG_LABELS[value.agg]} of ${value.field}`, value))
        .join("");
    }
    return `<div class="gc-pivot-area" data-area="${area}">
      <h4>${AREA_LABELS[area]}</h4>
      <div class="gc-pivot-drop" data-area="${area}">${chips}</div>
    </div>`;
  };

  root.innerHTML = `
    <header class="gc-pane-head">
      <h2>PivotTable Fields</h2>
      <button class="gc-icon-btn" type="button" data-pane-close title="Close">${icon("close", 14)}</button>
    </header>
    <p class="gc-pane-help">Choose fields to add to report:</p>
    <div class="gc-pane-scroll">
      <div class="gc-pivot-fields">
        ${fields
          .map(
            field =>
              `<label class="gc-pivot-field"><input type="checkbox" data-field="${escapeAttr(field)}"${
                memberships.has(field) ? " checked" : ""
              }/> ${field}</label>`
          )
          .join("")}
      </div>
      <div class="gc-pivot-areas">
        ${areaMarkup("filters")}
        ${areaMarkup("cols")}
        ${areaMarkup("rows")}
        ${areaMarkup("values")}
      </div>
      <p class="gc-pane-hint">Use a field's menu to move it between areas.</p>
      <div class="gc-pivot-actions">
        <button class="gc-btn" type="button" data-pivot-refresh>Refresh</button>
        <button class="gc-btn" type="button" data-pivot-layout>Report Layout ${icon("chevron-down", 10)}</button>
      </div>
    </div>
  `;

  root.querySelector("[data-pane-close]")?.addEventListener("click", callbacks.onClose);
  root.querySelector("[data-pivot-refresh]")?.addEventListener("click", callbacks.onRefresh);
  root.querySelectorAll<HTMLInputElement>("[data-field]").forEach(checkbox => {
    checkbox.addEventListener("change", () => callbacks.onFieldToggle(checkbox.dataset.field ?? "", checkbox.checked));
  });
  root.querySelectorAll<HTMLElement>("[data-pivot-chip]").forEach(element => {
    element.addEventListener("click", event => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-chip-close]")) {
        event.stopPropagation();
        const area = element.dataset.area as PivotArea;
        const field = element.dataset.field ?? "";
        const value = element.dataset.agg ? config.values.find(entry => entry.field === field) : undefined;
        if (value) {
          callbacks.onChipMenu(area, field, element, value);
        } else {
          callbacks.onChipMenu(area, field, element);
        }
        return;
      }
      const area = element.dataset.area as PivotArea;
      const field = element.dataset.field ?? "";
      const value = area === "values" ? config.values.find(entry => entry.field === field) : undefined;
      callbacks.onChipMenu(area, field, element, value);
    });
    element.addEventListener("dragstart", event => {
      event.dataTransfer?.setData("text/gridcraft-field", element.dataset.field ?? "");
      event.dataTransfer?.setData("text/gridcraft-area", element.dataset.area ?? "");
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    });
  });
  root.querySelectorAll<HTMLElement>(".gc-pivot-drop").forEach(zone => {
    const area = zone.dataset.area as PivotArea;
    zone.addEventListener("dragover", event => {
      event.preventDefault();
      zone.classList.add("is-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
    zone.addEventListener("drop", event => {
      event.preventDefault();
      zone.classList.remove("is-over");
      const field = event.dataTransfer?.getData("text/gridcraft-field");
      if (field) callbacks.onDropField(area, field);
    });
  });
  const layoutButton = root.querySelector<HTMLElement>("[data-pivot-layout]");
  if (layoutButton) layoutButton.addEventListener("click", () => callbacks.onLayout(layoutButton));
  return root;
}

function chip(field: string, area: PivotArea, subLabel?: string, value?: PivotValue): string {
  const label =
    area === "values" && subLabel ? subLabel : area === "filters" ? `${field} (${subLabel ?? "All"})` : field;
  return `<span class="gc-pivot-chip" draggable="true" data-pivot-chip data-area="${area}" data-field="${escapeAttr(
    field
  )}"${value ? ` data-agg="${value.agg}"` : ""}>
    <span class="gc-pivot-chip-label">${label}</span>
    <button class="gc-pivot-chip-close" type="button" data-chip-close title="Remove field">${icon("close", 10)}</button>
  </span>`;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function pivotMembership(config: PivotConfig, field: string): PivotArea | undefined {
  if (config.rows.includes(field)) return "rows";
  if (config.cols.includes(field)) return "cols";
  if (field in config.filters) return "filters";
  if (config.values.some(value => value.field === field)) return "values";
  return undefined;
}
