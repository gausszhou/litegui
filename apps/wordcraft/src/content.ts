/**
 * Sample document content and small data tables for the WordCraft demo.
 *
 * The handbook text is the same one shown in the WordCraft product tour, split
 * across the two pages of the demo document.
 */

export interface DocComment {
  id: string;
  author: string;
  initials: string;
  timestamp: string;
  text: string;
  /** CSS selector matching the reviewed block inside the pages. */
  anchor: string;
  resolved?: boolean;
}

export const DOC_TITLE = "The Open Studio Handbook";

export const COMMENTS: DocComment[] = [
  {
    id: "c1",
    author: "WordCraft User",
    initials: "WU",
    timestamp: "Just now",
    text: "Should we name the press? Members call it Big Bertha.",
    anchor: '[data-comment="c1"]'
  },
  {
    id: "c2",
    author: "WordCraft User",
    initials: "WU",
    timestamp: "2 min ago",
    text: "Add a sentence about the shared library of reference books.",
    anchor: '[data-comment="c2"]'
  },
  {
    id: "c3",
    author: "WordCraft User",
    initials: "WU",
    timestamp: "12 min ago",
    text: "Agreed at the March meeting.",
    anchor: '[data-comment="c3"]'
  }
];

export const PAGE_HEADER_ONE = `<div class="wc-page-header"><span>${DOC_TITLE}</span><span>Spring edition</span></div>`;
export const PAGE_HEADER_TWO = `<div class="wc-page-header"><span>${DOC_TITLE}</span><span>Spring edition</span></div>`;

export const PAGE_ONE = `${PAGE_HEADER_ONE}
<h1 class="wc-title" data-style="title">${DOC_TITLE}</h1>
<p class="wc-subtitle" data-style="subtitle">How a small community of makers shares space, tools and time</p>
<p>Every Thursday evening the old print shop on Alder Street fills with people who make things. <strong>Painters</strong> set up by the north windows, <em>letterpress</em> regulars claim the back room, and somebody always brings bread. This handbook collects what we have learned about running a shared studio: the routines that keep it <a href="#" data-link="pleasant">pleasant</a>, the tools we pool, and the small agreements that <span data-comment="c1">let <span class="wc-ins">forty</span><span class="wc-del">thirty</span> strangers become a crew.</span></p>

<h2 data-style="heading1">Why share a studio?</h2>
<p>Rent is the obvious reason, but it is not the best one. A shared room puts your work next to work you would never have seen otherwise. <span data-comment="c2">A <a href="#" data-link="ceramicist">ceramicist</a> explains glaze chemistry</span> to a comic artist; a photographer borrows a weaver's loom for a still life. The cross-talk is the point.</p>

<p class="wc-quote">A studio is a place where unfinished things are welcome.</p>

<h2 data-style="heading1">What we agree on</h2>
<ul>
  <li><span data-comment="c3"><strong>Clean as you go.</strong></span> Leave a table the way you would like to find it.</li>
  <li><strong>Label what is yours.</strong> Unlabelled supplies on the commons shelf are fair game.</li>
  <li><strong>Ask before you borrow.</strong> Even from the shelf, a quick note helps everyone keep track.</li>
  <li><strong>Quiet hours</strong> run from 9 to 11 on weekday mornings.</li>
</ul>`;

export const PAGE_TWO = `${PAGE_HEADER_TWO}
<h2 data-style="heading1">Shared equipment</h2>
<p>The table below lists what the membership owns together and who keeps each item in working order.</p>
<table class="wc-table">
  <thead>
    <tr><th>Equipment</th><th>Location</th><th>Steward</th><th>Booking</th></tr>
  </thead>
  <tbody>
    <tr><td>Etching press</td><td>Back room</td><td>Mara O.</td><td>Sign-up sheet</td></tr>
    <tr><td>Kiln (cone 10)</td><td>Yard shed</td><td>Theo P.</td><td>48 h notice</td></tr>
    <tr><td>Large-format printer</td><td>Office</td><td>Ines R.</td><td>Calendar</td></tr>
    <tr><td>Light table</td><td>North windows</td><td>Anyone</td><td>First come</td></tr>
  </tbody>
</table>

<h2 data-style="heading1">Opening the studio</h2>
<ol>
  <li>Switch on the main breaker by the door.</li>
  <li>Open both skylights unless it is raining.</li>
  <li>Start the kettle. This step is not optional.</li>
  <li>Check the booking sheet for the kiln and press.</li>
</ol>

<h2 data-style="heading1">Membership</h2>
<p>Membership is pay what you can, reviewed every season. New members shadow a regular for their first two visits, and everyone takes one cleaning shift a month. If you have never made anything before, you are exactly who we hoped would show up.</p>
<p>Questions go to the front desk, or to the notice board by the sink. Visit the <a href="#" data-link="community board">community board</a> for events.</p>

<div class="wc-footnotes" data-footnotes aria-label="Footnotes"></div>`;

export interface StylePreset {
  id: string;
  label: string;
  sample: string;
  className: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  { id: "normal", label: "Normal", sample: "AaBbCcDd", className: "" },
  { id: "nospacing", label: "No Spacing", sample: "AaBbCcDd", className: "wc-style-nospacing" },
  { id: "heading1", label: "Heading 1", sample: "AaBbCcDd", className: "wc-style-heading1" },
  { id: "title", label: "Title", sample: "AaBbCcDd", className: "wc-style-title" },
  { id: "heading2", label: "Heading 2", sample: "AaBbCcDd", className: "wc-style-heading2" },
  { id: "subtitle", label: "Subtitle", sample: "AaBbCcDd", className: "wc-style-subtitle" }
];

export const FONT_FAMILIES = [
  "Aptos",
  "Calibri",
  "Cambria",
  "Georgia",
  "Garamond",
  "Segoe UI",
  "Times New Roman",
  "Arial"
];

export const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

export interface DocumentTheme {
  id: string;
  label: string;
  hint: string;
}

export const DOC_THEMES: DocumentTheme[] = [
  { id: "studio", label: "Studio", hint: "Calibri · Word blue" },
  { id: "editorial", label: "Editorial", hint: "Cambria · warm ink" },
  { id: "slate", label: "Slate", hint: "Segoe UI · graphite" },
  { id: "contrast", label: "High Contrast", hint: "Arial · black" }
];

export const PAGE_COLORS = [
  { id: "white", label: "White", value: "#ffffff" },
  { id: "cream", label: "Cream", value: "#fbf6e9" },
  { id: "mist", label: "Mist", value: "#eef2f6" },
  { id: "sage", label: "Sage", value: "#eef2ea" }
];

export const CITATIONS = [
  "Okafor, M. (2026). Shared studios and the tools we keep. Alder Street Press.",
  "Patel, T. (2025). The membership model. Open Studio Review, 12(3), 44–59.",
  "Reyes, I. (2024). Notes on collective equipment. In Making Together (pp. 81–96)."
];

export const OUTLINE_LEVELS: Record<string, number> = {
  "wc-title": 1,
  "wc-style-title": 1,
  "wc-h1": 2,
  "wc-style-heading1": 2,
  "wc-h2": 3,
  "wc-style-heading2": 3,
  "wc-h3": 4
};
