import type { Page, PdfDoc } from "./types";

export const PAGE_W = 816;
export const PAGE_H = 1056;

/* ------------------------------------------------------------------ helpers */

let activeBrand = "PDFCRAFT SHOWCASE";

function brandFor(doc: PdfDoc): string {
  return doc.name
    .replace(/\.pdf$/i, "")
    .replace(/[-_]+/g, " ")
    .toUpperCase();
}

function running(page: Page): string {
  if (page.kind === "cover") return "";
  const right = page.section ? `${page.label ? `${page.label} · ` : ""}${page.section.toUpperCase()}` : "";
  return `<header class="pg-running"><span>${activeBrand}</span><span>${right}</span></header>`;
}

function footer(page: Page): string {
  if (page.kind === "cover") return "";
  return `<footer class="pg-foot"><span>${page.section}</span><span class="pg-folio">${page.label}</span></footer>`;
}

function sheet(page: Page, body: string, extraClass = ""): string {
  return `<div class="pg-sheet ${extraClass}">${running(page)}<div class="pg-body">${body}</div>${footer(page)}</div>`;
}

function tocRow(number: string, title: string, note: string, target: string): string {
  return `<li class="pg-toc-row">
    <span class="pg-toc-num">${number}</span>
    <span class="pg-toc-title">${title}<em>${note}</em></span>
    <span class="pg-toc-dots"></span>
    <span class="pg-toc-page">${target}</span>
  </li>`;
}

/* ------------------------------------------------------------------ cover */

function coverPage(): string {
  return `<div class="pg-cover">
    <div class="pg-cover-wash"></div>
    <svg class="pg-cover-sun" viewBox="0 0 400 300" aria-hidden="true">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffb46a"/>
          <stop offset="55%" stop-color="#e2563c" stop-opacity=".72"/>
          <stop offset="100%" stop-color="#8d1e2b" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ff8b5e"/>
          <stop offset="100%" stop-color="#7c1d38" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="150" r="120" fill="url(#sunGrad)"/>
      <circle cx="200" cy="150" r="62" fill="#ffcf9a" opacity=".22"/>
      <path d="M0 208C58 196 92 214 148 206s96-18 152-6 80 2 100-4v104H0z" fill="url(#waveGrad)"/>
    </svg>
    <div class="pg-cover-grain"></div>
    <div class="pg-cover-top">
      <span class="pg-cover-mark">◼ PDFCRAFT</span>
      <span>SPECIMEN 01 · 2026</span>
    </div>
    <div class="pg-cover-copy">
      <span class="pg-cover-kicker">A DOCUMENT TO OPEN AFTER EVERY CHANGE</span>
      <h1 class="pg-cover-title">PdfCraft<br/><em>Showcase</em></h1>
      <p class="pg-cover-sub">A tour of the page, glyph by glyph.</p>
      <div class="pg-cover-meta">
        <span>13 pages</span><span>14 annotations</span><span>13 form fields</span>
      </div>
    </div>
    <div class="pg-cover-foot">
      <span>Open-source PDF toolkit for the web</span>
      <span>US Letter · 8.5 × 11 in</span>
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ contents */

function contentsPage(page: Page): string {
  const rows = [
    ["00", "Why a specimen?", "A short defence of looking closely", "ii"],
    ["01", "Setting Text", "Columns, drop caps and hyphenation", "1"],
    ["02", "OpenType Features", "Ligatures, figures and alternates", "2"],
    ["03", "Expressive Type", "Layered, clipped and outlined words", "3"],
    ["04", "Scripts of the World", "Twelve writing systems on one page", "4"],
    ["05", "Mathematics", "Formulae set in the same body face", "5"],
    ["06", "Vector Graphics", "Colour, gradient and geometry", "6"],
    ["07", "Data & Tables", "Charts, rules and tabular figures", "7"],
    ["08", "Code & Images", "A listing and a generated texture", "8"],
    ["09", "Review & Markup", "Highlights, notes and stamps", "9"],
    ["10", "Interactive Form", "Thirteen fields, drawn as authored", "10"]
  ];
  const body = `
    <div class="pg-contents-head">
      <span class="pg-kicker">FRONT MATTER</span>
      <h2 class="pg-display">Contents</h2>
      <p class="pg-standfirst">Eleven specimens, one working document. The page numbers follow the
      document's own labels: front matter in roman numerals, then the chapters.</p>
    </div>
    <ol class="pg-toc">
      ${rows.map(row => tocRow(row[0], row[1], row[2], row[3])).join("")}
    </ol>
    <aside class="pg-pullbox">
      <span class="pg-pullbox-label">HOW TO READ THIS FILE</span>
      <p>Every page is generated in the browser from a small layout model: text, rules, tables and
      vector art. Nothing here is an image of a page — zoom in and the type stays sharp.</p>
    </aside>`;
  return sheet(page, body, "pg-contents");
}

/* ------------------------------------------------------------------ foreword */

function forewordPage(page: Page): string {
  const tracks = [
    ["-40", "tight", "-.012em"],
    ["0", "normal", "0"],
    ["+120", "open", ".05em"],
    ["+300", "airy", ".14em"]
  ];
  const body = `
    <span class="pg-kicker">FOREWORD</span>
    <h2 class="pg-display">Why a <em>specimen</em>?</h2>
    <p class="pg-lede">A PDF is judged in the second second. The page appears, and either the
    letters sit on it the way the author intended or they do not.</p>
    <div class="pg-two-col pg-foreword-cols">
      <p class="pg-para"><span class="pg-smallcap">T</span>his document collects those promises in one
      place. It was written for the people who build the workbench, as a single file to open after
      every change: if all of it still looks right, the change is probably safe. It is also, we hope,
      pleasant to read on its own.</p>
      <p class="pg-para">Nothing here is exotic. Each feature is something ordinary documents use every
      day — an invoice with a form field, a contract with a comment in the margin, a report with a
      chart. What is unusual is only that they are all together, and that each page says plainly what
      it is testing.</p>
      <p class="pg-para">The layout is authored in HTML and printed by a browser; the interactive
      parts are then written into the file by hand. That split mirrors the real world, where most PDFs
      are produced by one program and amended by several others.</p>
      <p class="pg-para">Read it as a checklist rather than a manifesto. Every kerning pair is a small
      promise the file makes to the reader, and the renderer is what keeps it.</p>
    </div>
    <p class="pg-signature">The PdfCraft contributors</p>
    <div class="pg-families">
      <div class="pg-families-head"><span>THE FAMILIES IN THIS SPECIMEN</span><span>ROLE</span></div>
      <div class="pg-family-grid">
        <div class="pg-family"><span class="pg-family-sample">Aa</span><em>Display</em><small>Headings only</small></div>
        <div class="pg-family"><span class="pg-family-sample">Ag</span><em>Text</em><small>Body copy</small></div>
        <div class="pg-family"><span class="pg-family-sample is-sans">Ag</span><em>Labels</em><small>Captions</small></div>
        <div class="pg-family"><span class="pg-family-sample is-mono">{ }</span><em>Code</em><small>Listings</small></div>
        <div class="pg-family"><span class="pg-family-sample is-italic">Cg</span><em>Script</em><small>Signatures</small></div>
        <div class="pg-family"><span class="pg-family-sample">∑</span><em>Math</em><small>Formulae</small></div>
      </div>
    </div>
    <div class="pg-tracking">
      <div class="pg-tracking-head"><span>TRACKING, FROM TIGHT TO AIRY</span><span>VALUE</span></div>
      ${tracks
        .map(
          ([value, name, letter]) => `<div class="pg-tracking-row">
            <span class="pg-tracking-sample" style="letter-spacing:${letter}">MEASURE TWICE, SET ONCE</span>
            <span class="pg-tracking-value">${value} <em>${name}</em></span>
          </div>`
        )
        .join("")}
    </div>`;
  return sheet(page, body, "pg-foreword");
}

/* ------------------------------------------------------------------ chapter */

function chapterPage(page: Page): string {
  const body = `
    <span class="pg-kicker">CHAPTER ONE</span>
    <h2 class="pg-display">Setting <em>Text</em></h2>
    <p class="pg-standfirst">Two justified columns with automatic hyphenation, old-style figures and
    a drop cap — the everyday machinery of a well-made page.</p>
    <div class="pg-two-col pg-chapter-cols">
      <p class="pg-para pg-dropcap"><span class="pg-dropcap-letter">L</span>ong before there were
      screens, a page of type was a negotiation between the width of a column and the length of the
      words that had to fill it. The compositor adjusted spaces, divided a word at a sensible syllable,
      and occasionally rewrote a line so the paragraph would lie flat. Justified text asks for exactly
      that care.</p>
      <p class="pg-para">A PDF does not reflow. Every glyph has already been placed by the program that
      wrote the file, and the reader's job is to reproduce those positions faithfully at any zoom.
      Hyphenation is where browsers and word processors differ most; the composer consults a
      dictionary, divides at a natural break, and leaves the rest of the column alone.</p>
      <p class="pg-para">Columns introduce their own questions: where to break, whether a heading may
      sit at the foot of one, and how a quotation spanning both should interrupt the flow. Here the
      pull quote spans the full measure and the text resumes beneath it.</p>
      <p class="pg-para">Small text matters too. Notes and captions are often set at seven or eight
      points, where hinting, stem darkening and subpixel positioning decide whether a reader squints.
      The footnotes below are set at seven and a half and a half a point in the same face.</p>
    </div>
    <blockquote class="pg-pullquote">
      <p>“Good typography is noticed only when it is missing.”</p>
      <cite>A working maxim of the trade</cite>
    </blockquote>
    <div class="pg-two-col pg-chapter-tail">
      <p class="pg-para">Finally, notice the drop cap that opens this chapter. It is an ordinary
      letter, floated and enlarged, with the first line set in small capitals. A renderer needs to do
      nothing special for it, which is precisely the point: most typographic richness in a PDF is
      just careful placement of ordinary glyphs.</p>
      <p class="pg-para">The test is always the same: set the words, step back, and see whether the
      page reads as a single object or as a pile of boxes.</p>
    </div>
    <div class="pg-footnotes">
      <p><sup>1</sup> Word spacing in PDF is usually baked into glyph positions rather than expressed
      with the word-spacing operator, so readers rarely need to stretch anything themselves.</p>
      <p><sup>2</sup> In a PDF a ligature is a single glyph: text extraction relies on the font's
      ToUnicode map to recover the letters it represents.</p>
      <p><sup>3</sup> Try zooming to 400 percent here: well-rendered small text stays crisp.</p>
    </div>`;
  return sheet(page, body, "pg-chapter");
}

/* ------------------------------------------------------------------ features */

function featuresPage(page: Page): string {
  const rows: Array<[string, string, string]> = [
    ["Ligatures", '<span class="pg-sample-lig">ffi · ffl · ff</span>', "Standard and discretionary"],
    ["Small caps", '<span class="pg-sample-sc">Small caps in running text</span>', "With tracked settings"],
    ["Old-style figures", '<span class="pg-sample-osf">0123456789</span>', "Text figures, proportional"],
    ["Tabular figures", '<span class="pg-sample-tab">0123456789</span>', "Fixed advance width"],
    ["Fractions", '<span class="pg-sample-frac">1⁄2 · 3⁄4 · 7⁄8</span>', "Case fractions"],
    ["Superscript", '<span class="pg-sample-sup">x² + y³ = z⁴</span>', "Raised and reduced"],
    ["Swashes", '<span class="pg-sample-swash">Q &amp; A</span>', "Decorative terminals"],
    ["Stylistic sets", '<span class="pg-sample-alt">a · g · y</span>', "Single-storey alternates"]
  ];
  const body = `
    <span class="pg-kicker">CHAPTER TWO</span>
    <h2 class="pg-display">OpenType <em>Features</em></h2>
    <p class="pg-standfirst">The text face is asked to do more than draw letters: it is asked to draw
    the right letters, in the right style, at the right size.</p>
    <div class="pg-feature-intro pg-two-col">
      <p class="pg-para">OpenType features are switches inside a font. A document that sets them
      explicitly gets the typography its author chose; a document that leaves them to defaults gets
      whatever the reader's engine decides. The difference is visible on any page with numbers in it.</p>
      <p class="pg-para">The table below is the working set for this specimen. Each sample is rendered
      in the same face at the same size, so only the feature changes.</p>
    </div>
    <table class="pg-feature-table">
      <thead><tr><th>Feature</th><th>Sample</th><th>Notes</th></tr></thead>
      <tbody>
        ${rows
          .map(
            ([feature, sample, note]) =>
              `<tr><td class="pg-feature-name">${feature}</td><td>${sample}</td><td class="pg-feature-note">${note}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>
    <div class="pg-two-col pg-feature-notes">
      <div class="pg-note-block">
        <span class="pg-note-label">THE FACE</span>
        <p>One text face, one display face and one mono. The specimen deliberately avoids a fourth,
        because most real documents cannot afford one.</p>
      </div>
      <div class="pg-note-block">
        <span class="pg-note-label">THE TEST</span>
        <p>Set the same paragraph twice, once with each figure style. If the columns shift, the face
        is not using tabular widths where it said it would.</p>
      </div>
    </div>
    <div class="pg-badge">13 OPENTYPE FEATURES ENABLED</div>`;
  return sheet(page, body, "pg-features");
}

/* ------------------------------------------------------------------ expressive */

function expressivePage(page: Page): string {
  const body = `
    <span class="pg-kicker">CHAPTER THREE</span>
    <h2 class="pg-display">Expressive <em>Type</em></h2>
    <p class="pg-standfirst">Four treatments of a single word, drawn with gradients, clipping paths,
    outlines and a little controlled excess.</p>
    <div class="pg-expressive-grid">
      <div class="pg-specimen">
        <div class="pg-specimen-art pg-art-layered"><span>Layered</span></div>
        <span class="pg-specimen-label">Layered</span>
        <span class="pg-specimen-note">Three offsets, multiply blend</span>
      </div>
      <div class="pg-specimen">
        <div class="pg-specimen-art pg-art-spectrum"><span>Spectrum</span></div>
        <span class="pg-specimen-label">Spectrum</span>
        <span class="pg-specimen-note">Four-stop gradient clip</span>
      </div>
      <div class="pg-specimen">
        <div class="pg-specimen-art pg-art-clip"><span>Clip</span></div>
        <span class="pg-specimen-label">Clip</span>
        <span class="pg-specimen-note">Ink inside the counters</span>
      </div>
      <div class="pg-specimen">
        <div class="pg-specimen-art pg-art-outline"><span>Outline</span></div>
        <span class="pg-specimen-label">Outline</span>
        <span class="pg-specimen-note">Hairline, no fill</span>
      </div>
    </div>
    <svg class="pg-wave" viewBox="0 0 700 90" aria-hidden="true">
      <defs>
        <linearGradient id="waveLine" x1="0" x2="1">
          <stop offset="0%" stop-color="#c2412d"/>
          <stop offset="50%" stop-color="#d9a24a"/>
          <stop offset="100%" stop-color="#3c6e9f"/>
        </linearGradient>
      </defs>
      <path d="M2 54C60 12 118 12 176 54s116 42 174 0 116-42 174 0 116 42 172 0" fill="none" stroke="url(#waveLine)" stroke-width="2.2"/>
      <path d="M2 66C60 24 118 24 176 66s116 42 174 0 116-42 174 0 116 42 172 0" fill="none" stroke="url(#waveLine)" stroke-width=".8" opacity=".45"/>
    </svg>
    <div class="pg-two-col pg-expressive-tail">
      <p class="pg-para">Display type is where a document shows off, and where a renderer is most
      likely to be caught out: clipped gradients, soft masks and transparency all have to survive the
      trip from editor to viewer.</p>
      <p class="pg-para">The rule here is simple. If a treatment cannot be described to a printer in one
      sentence, it is not ready for the page.</p>
    </div>
    <div class="pg-caption">Contrast is the engine of design. These four words are the same letters
    under four different constraints.</div>`;
  return sheet(page, body, "pg-expressive");
}

/* ------------------------------------------------------------------ scripts */

const SCRIPTS: Array<[string, string, string, string]> = [
  ["Arabic", "الجملة العربية", "rtl", "Noto Naskh"],
  ["Hebrew", "עברית היא יפה", "rtl", "Noto Serif Hebrew"],
  ["Devanagari", "देवनागरी लिपि", "ltr", "Noto Serif Devanagari"],
  ["Thai", "อักษรไทย", "ltr", "Noto Serif Thai"],
  ["Greek", "Ἑλληνικὴ γλῶσσα", "ltr", "Noto Serif Greek"],
  ["Cyrillic", "Кириллица", "ltr", "Noto Serif"],
  ["Chinese", "汉字排版", "ltr", "Noto Serif CJK"],
  ["Korean", "한글 조판", "ltr", "Noto Serif CJK"],
  ["Armenian", "Հայերեն", "ltr", "Noto Serif Armenian"],
  ["Georgian", "ქართული", "ltr", "Noto Serif Georgian"],
  ["Tamil", "தமிழ் எழுத்து", "ltr", "Noto Serif Tamil"],
  ["Latin", "Sphinx of black quartz", "ltr", "The text face"]
];

function scriptsPage(page: Page): string {
  const body = `
    <span class="pg-kicker">CHAPTER THREE</span>
    <h2 class="pg-display">Scripts of the <em>World</em></h2>
    <p class="pg-standfirst">Twelve writing systems in one column measure, plus vertical Japanese in
    the margin — the page a rendering engine has to pass before it can be trusted.</p>
    <div class="pg-scripts-wrap">
      <div class="pg-scripts-grid">
        ${SCRIPTS.map(
          ([name, sample, dir, font]) => `<div class="pg-script-card">
            <span class="pg-script-name">${name}</span>
            <span class="pg-script-sample" dir="${dir}" style="font-family:${font}, serif">${sample}</span>
            <span class="pg-script-meta">${font}</span>
          </div>`
        ).join("")}
      </div>
      <aside class="pg-vertical" lang="ja">縦組は右から左へ、行は上から下へ流れます。</aside>
    </div>
    <div class="pg-scripts-foot pg-two-col">
      <p class="pg-para">Complex scripts do not merely need the right glyphs; they need the right
      shaping. Arabic joins, Devanagari reorders, Thai stacks. A viewer that draws codepoints in order
      will look broken here, and the page will tell you at a glance.</p>
      <p class="pg-para">The vertical Japanese aside tests the other axis: line progression from top to
      bottom, columns advancing right to left, punctuation rotated or repositioned as the script
      requires.</p>
    </div>
    <div class="pg-caption">Sample strings are set in the matching Noto families where the system
    provides them; missing faces fall back to the nearest serif.</div>`;
  return sheet(page, body, "pg-scripts");
}

/* ------------------------------------------------------------------ math */

function mathPage(page: Page): string {
  const body = `
    <span class="pg-kicker">CHAPTER THREE</span>
    <h2 class="pg-display">Mathe<em>matics</em></h2>
    <p class="pg-standfirst">A formula is a sentence with a different alphabet. Set it in the same
    body face, with the operators given room to breathe.</p>
    <div class="pg-equations">
      <div class="pg-equation">
        <span class="pg-eq-body">∫<sub>0</sub><sup>∞</sup> e<sup>−x²</sup> dx = √π⁄2</span>
        <span class="pg-eq-tag">(1)</span>
      </div>
      <div class="pg-equation">
        <span class="pg-eq-body">∑<sub>k=1</sub><sup>n</sup> k² = n(n+1)(2n+1)⁄6</span>
        <span class="pg-eq-tag">(2)</span>
      </div>
      <div class="pg-equation">
        <span class="pg-eq-body">A = <span class="pg-matrix">[ a b<br/>c d ]</span> , det A = ad − bc</span>
        <span class="pg-eq-tag">(3)</span>
      </div>
      <div class="pg-equation">
        <span class="pg-eq-body">f(x) = 1⁄(σ√2π) e<sup>−(x−μ)²⁄2σ²</sup></span>
        <span class="pg-eq-tag">(4)</span>
      </div>
    </div>
    <div class="pg-two-col pg-math-cols">
      <p class="pg-para">Inline mathematics is the harder test, because it has to sit on the same
      baseline as the surrounding prose without opening the leading. A well-set paragraph lets
      <span class="pg-inline-math">e<sup>iπ</sup> + 1 = 0</span> pass through it like any other
      phrase.</p>
      <p class="pg-para">Operators carry spacing the way words carry spaces: a little before and after
      a relation, none inside a function name, a little more around a sum. The table below records the
      settings this specimen uses.</p>
    </div>
    <table class="pg-op-table">
      <thead><tr><th>Element</th><th>Setting</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Relation</td><td>4mu each side</td><td class="pg-op-sample">a = b</td></tr>
        <tr><td>Binary operator</td><td>3mu each side</td><td class="pg-op-sample">a + b</td></tr>
        <tr><td>Integral</td><td>2mu before the sign</td><td class="pg-op-sample">∫ f dx</td></tr>
        <tr><td>Limit</td><td>1mu, reduced 70%</td><td class="pg-op-sample">lim<sub>x→0</sub></td></tr>
        <tr><td>Fraction</td><td>Rule on the math axis</td><td class="pg-op-sample">a⁄b</td></tr>
      </tbody>
    </table>
    <blockquote class="pg-math-quote">“The integral sign is a long s. Everything else is convention.”</blockquote>
    <div class="pg-caption">Equations 1–4 are set from the same text face; the matrix is a table, not
    an image.</div>`;
  return sheet(page, body, "pg-math");
}

/* ------------------------------------------------------------------ vector */

function vectorPage(page: Page): string {
  const swatches: Array<[string, string, string]> = [
    ["Vermilion", "#c2412d", "linear-gradient(135deg,#e06a4f,#9c2b22)"],
    ["Ochre", "#c89243", "linear-gradient(135deg,#e3b96e,#a6772a)"],
    ["Cobalt", "#3c6e9f", "linear-gradient(135deg,#6f9dc4,#2f5678)"],
    ["Iris", "#6b5a9e", "linear-gradient(135deg,#9a8ac7,#4c3f7d)"]
  ];
  const body = `
    <span class="pg-kicker">CHAPTER THREE</span>
    <h2 class="pg-display">Vector <em>Graphics</em></h2>
    <p class="pg-standfirst">Shapes, gradients and colour chips: everything on this page is a path
    with a fill, not a photograph.</p>
    <div class="pg-vector-grid">
      <svg viewBox="0 0 340 220" aria-hidden="true">
        <defs>
          <linearGradient id="vgSky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f2c27b"/>
            <stop offset="45%" stop-color="#d96a52"/>
            <stop offset="100%" stop-color="#4e3f7b"/>
          </linearGradient>
          <radialGradient id="vgOrb" cx="42%" cy="38%" r="60%">
            <stop offset="0%" stop-color="#ffe6b8"/>
            <stop offset="55%" stop-color="#e8894f"/>
            <stop offset="100%" stop-color="#7d2f3d"/>
          </radialGradient>
        </defs>
        <rect width="340" height="220" rx="4" fill="url(#vgSky)"/>
        <circle cx="122" cy="92" r="58" fill="url(#vgOrb)"/>
        <circle cx="122" cy="92" r="30" fill="#f8d9a8" opacity=".3"/>
        <path d="M0 168c46-22 78-4 118 8s70 16 112-2 66-22 110-8v54H0z" fill="#2c2340" opacity=".82"/>
        <path d="M0 188c46-16 78 2 118 12s70 12 112-4 66-14 110-2v26H0z" fill="#191528"/>
        <g fill="none" stroke="#f4e4c8" stroke-width=".8" opacity=".5">
          <path d="M28 40l10-10M246 34l8-8M206 60l6-6M290 120l6-6"/>
        </g>
      </svg>
      <div class="pg-vector-side">
        <div class="pg-swatch-list">
          ${swatches
            .map(
              ([name, hex, gradient]) => `<div class="pg-swatch">
                <span class="pg-swatch-chip" style="--sw:${gradient}"></span>
                <span class="pg-swatch-name">${name}<em>${hex}</em></span>
              </div>`
            )
            .join("")}
        </div>
        <div class="pg-vector-note">
          <span class="pg-note-label">GEOMETRY</span>
          <p>One circle, one horizon, four gradients. The picture is three paths and a little noise —
          which is exactly what a vector renderer should make cheap.</p>
        </div>
      </div>
    </div>
    <div class="pg-vector-strip">
      <svg viewBox="0 0 700 120" aria-hidden="true">
        <defs>
          <linearGradient id="vgRing" x1="0" x2="1">
            <stop offset="0%" stop-color="#c2412d"/>
            <stop offset="40%" stop-color="#d9a24a"/>
            <stop offset="100%" stop-color="#3c6e9f"/>
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#vgRing)" stroke-width="1.4">
          ${Array.from(
            { length: 11 },
            (_, i) => `<circle cx="84" cy="60" r="${8 + i * 5.4}" opacity="${0.85 - i * 0.05}"/>`
          ).join("")}
        </g>
        <path d="M214 96c20-60 48-72 76-36s54 32 78-8 50-40 74 4 46 44 76 2" fill="none" stroke="#3b3831" stroke-width="1.2"/>
        <g transform="translate(556 20)">
          <path d="M34 0l10 24 26 2-20 17 6 26-22-14-22 14 6-26L-2 26l26-2z" fill="#e8dcc4" stroke="#3b3831" stroke-width="1"/>
        </g>
      </svg>
    </div>
    <div class="pg-caption">The colour chips are linear gradients with two stops; the rings show how
    hairline strokes behave at 200% zoom.</div>`;
  return sheet(page, body, "pg-vector");
}

/* ------------------------------------------------------------------ tables */

function tablesPage(page: Page): string {
  const bars = [
    ["Q1", 48, "#c2412d"],
    ["Q2", 66, "#c89243"],
    ["Q3", 58, "#3c6e9f"],
    ["Q4", 82, "#6b5a9e"]
  ] as const;
  const rows = [
    ["North", "£182,400", "£168,900", "+8.0%"],
    ["South", "£146,200", "£151,300", "−3.4%"],
    ["East", "£98,750", "£90,100", "+9.6%"],
    ["West", "£121,300", "£104,800", "+15.7%"],
    ["Online", "£204,900", "£176,500", "+16.1%"],
    ["Total", "£753,550", "£691,600", "+8.9%"]
  ];
  const body = `
    <span class="pg-kicker">CHAPTER THREE</span>
    <h2 class="pg-display">Data &amp; <em>Tables</em></h2>
    <p class="pg-standfirst">Figures line up because the type says they should; charts read because
    the grid is quiet.</p>
    <div class="pg-charts">
      <figure class="pg-chart">
        <figcaption><span>REVENUE BY QUARTER</span><span>£ thousands</span></figcaption>
        <svg viewBox="0 0 320 170" aria-hidden="true">
          <g stroke="#d8d2c4" stroke-width="1">
            <path d="M26 20v120M26 140h276M26 110h276M26 80h276M26 50h276"/>
          </g>
          ${bars
            .map(
              ([label, value, colour], index) => `<g>
                <rect x="${52 + index * 64}" y="${140 - value * 1.4}" width="34" height="${
                value * 1.4
              }" fill="${colour}"/>
                <text x="${69 + index * 64}" y="156" text-anchor="middle" class="pg-chart-label">${label}</text>
                <text x="${69 + index * 64}" y="${
                132 - value * 1.4
              }" text-anchor="middle" class="pg-chart-value">${value}</text>
              </g>`
            )
            .join("")}
        </svg>
      </figure>
      <figure class="pg-chart">
        <figcaption><span>MARGIN TREND</span><span>per cent</span></figcaption>
        <svg viewBox="0 0 320 170" aria-hidden="true">
          <g stroke="#d8d2c4" stroke-width="1">
            <path d="M26 20v120M26 140h276M26 110h276M26 80h276M26 50h276"/>
          </g>
          <path d="M26 122L78 108 130 118 182 84 234 66 286 44" fill="none" stroke="#c2412d" stroke-width="2"/>
          ${[122, 108, 118, 84, 66, 44]
            .map((y, index) => `<circle cx="${26 + index * 52}" cy="${y}" r="3" fill="#c2412d"/>`)
            .join("")}
          <path d="M26 128L78 120 130 112 182 104 234 88 286 76" fill="none" stroke="#3c6e9f" stroke-width="1.2" stroke-dasharray="4 3"/>
        </svg>
      </figure>
    </div>
    <table class="pg-data-table">
      <thead><tr><th>Region</th><th>2026</th><th>2025</th><th>Change</th></tr></thead>
      <tbody>
        ${rows
          .map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="pg-up">${r[3]}</td></tr>`)
          .join("")}
      </tbody>
    </table>
    <p class="pg-table-note"><sup>4</sup> Q3 figures are provisional and include one late invoice;
    audited totals will differ by a small amount.</p>
    <div class="pg-caption">Tabular figures keep the decimal points in a column. Proportional figures
    would make the totals ragged.</div>`;
  return sheet(page, body, "pg-tables");
}

/* ------------------------------------------------------------------ code */

function codePage(page: Page): string {
  const body = `
    <span class="pg-kicker">CHAPTER FOUR</span>
    <h2 class="pg-display">Code &amp; <em>Images</em></h2>
    <p class="pg-standfirst">A listing in a monospaced face, next to a texture generated at print
    resolution — two very different kinds of pixels on the same page.</p>
    <pre class="pg-code"><code><span class="c-key">const</span> page = <span class="c-var">doc</span>.<span class="c-fn">pages</span>[<span class="c-num">3</span>];

<span class="c-comment">// Content streams are just PDF operators.</span>
<span class="c-key">await</span> <span class="c-var">page</span>.<span class="c-fn">draw</span>({
  font: <span class="c-str">"/F1 11 Tf"</span>,
  leading: <span class="c-num">16</span>,
  colour: <span class="c-str">"0.16 0.14 0.12 rg"</span>,
  text: <span class="c-str">"Every glyph has already been placed."</span>
});

<span class="c-key">if</span> (<span class="c-var">zoom</span> &gt; <span class="c-num">400</span>) {
  <span class="c-var">renderer</span>.<span class="c-fn">switchToTiles</span>(); <span class="c-comment">// stay sharp</span>
}
</code></pre>
    <div class="pg-code-meta"><span>listing 1</span><span>TypeScript</span><span>8 lines</span></div>
    <div class="pg-image-block">
      <svg viewBox="0 0 700 220" aria-hidden="true">
        <defs>
          <filter id="pgNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="7"/>
            <feColorMatrix type="matrix" values="
              0.55 0.25 0.1 0 0.1
              0.18 0.42 0.2 0 0.08
              0.12 0.2 0.5 0 0.16
              0 0 0 0 1"/>
            <feComposite operator="in" in2="SourceGraphic"/>
          </filter>
          <linearGradient id="pgImgWash" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#3b4a63"/>
            <stop offset="100%" stop-color="#7b4a3c"/>
          </linearGradient>
        </defs>
        <rect width="700" height="220" fill="url(#pgImgWash)"/>
        <rect width="700" height="220" fill="#fff" filter="url(#pgNoise)" opacity=".9"/>
        <g fill="none" stroke="#f4e4c8" stroke-width=".7" opacity=".45">
          <path d="M0 168c70-28 130-10 190 10s150 22 226-8 190-24 284-2"/>
          <path d="M0 188c70-20 130-2 190 12s150 16 226-10 190-16 284 0"/>
        </g>
      </svg>
      <span class="pg-image-caption">Plate 1 — a Julia-set texture, generated for this page at
      600 dpi and embedded as a single image.</span>
    </div>
    <div class="pg-caption">Code is set in a mono face with syntax colour; the listing is selectable
    text, not a screenshot.</div>`;
  return sheet(page, body, "pg-page-code");
}

/* ------------------------------------------------------------------ markup */

function markupPage(page: Page): string {
  const body = `
    <div class="pg-draft" data-layer="draft">DRAFT</div>
    <span class="pg-kicker">CHAPTER FOUR</span>
    <h2 class="pg-display">Review &amp; <em>Markup</em></h2>
    <p class="pg-standfirst">Comments in the margin, a highlight on the sentence that matters, and a
    stamp that says the page is ready — or is not.</p>
    <div class="pg-two-col pg-markup-cols">
      <p class="pg-para">Pages come back from review covered in small signals. A <span class="pg-hl">highlight</span>
      marks a phrase to keep. A <span class="pg-ul">note</span> in the margin explains why. Sticky
      notes hold threaded discussions, and an ink sketch can say in one curve what a paragraph cannot.</p>
      <p class="pg-para">Annotations are objects in their own right. A renderer that draws them should
      also let the reader hide them, print them, or switch them off entirely — which is why this page
      carries an <span class="pg-hl">optional content layer</span> for the watermark and one for
      print-only notes.</p>
      <p class="pg-para">The stamp is the last thing an editor adds and the first thing a reader
      looks for.</p>
      <div class="pg-stamp">APPROVED</div>
      <div class="pg-margin-note pg-print-note" data-layer="notes">
        <span>PRINT-ONLY NOTE</span>
        <p>Trim marks are inside the bleed. Do not scale this page.</p>
      </div>
    </div>
    <div class="pg-markup-aside">
      <svg viewBox="0 0 220 120" class="pg-ink" aria-hidden="true">
        <path d="M18 84c24-40 46-46 62-22s28 30 50 6 38-28 54-6" fill="none" stroke="#3c6e9f" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M34 96c30-8 56-6 82 4s54 6 82-6" fill="none" stroke="#c2412d" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>
      </svg>
      <div class="pg-note-card">
        <span class="pg-note-author">Layout Editor</span>
        <p>“Keep the pull quote; the highlight is for the wording, not the type size.”</p>
        <span class="pg-note-date">30 Sep · 15:31</span>
      </div>
      <div class="pg-note-card pg-note-card-2">
        <span class="pg-note-author">Type Engine</span>
        <p>“Every glyph is an object. Annotations are objects too.”</p>
        <span class="pg-note-date">30 Sep · 15:39</span>
      </div>
    </div>
    <div class="pg-review-strip">
      <span class="pg-review-label">REVIEW CHECKS</span>
      <div><em>✓</em> Highlighter anchors to the phrase</div>
      <div><em>✓</em> Replies keep their thread</div>
      <div><em>✓</em> Stamps print with the page</div>
    </div>
    <div class="pg-markup-foot pg-two-col">
      <p class="pg-para">Please cite a source for this claim. This sentence deliberately carries an
      underline comment rather than a highlight, to show that both anchors survive a re-render.</p>
      <p class="pg-para">When the page is saved, these annotations are written into the file as
      separate objects, keeping their replies, status and author information intact.</p>
    </div>`;
  return sheet(page, body, "pg-markup");
}

/* ------------------------------------------------------------------ form */

function inputField(id: string, value: string, placeholder = ""): string {
  return `<input class="pg-input" data-field="${id}" type="text" value="${escapeAttr(value)}" placeholder="${escapeAttr(
    placeholder
  )}" />`;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function formPage(page: Page, doc: PdfDoc): string {
  const v = doc.values;
  const str = (key: string): string => (typeof v[key] === "string" ? (v[key] as string) : "");
  const checked = (key: string): string => (v[key] === true ? " checked" : "");
  const countries = ["United Kingdom", "Germany", "Japan", "United States", "Brazil"];
  const body = `
    <span class="pg-kicker">CHAPTER FOUR</span>
    <h2 class="pg-display">Interactive <em>Form</em></h2>
    <p class="pg-standfirst">Thirteen fields, drawn the way their author designed them: typing,
    choosing, ticking and signing all happen on the page.</p>
    <form class="pg-form" autocomplete="off" onsubmit="return false">
      <div class="pg-form-row">
        <label class="pg-label">FULL NAME ${inputField("name", str("name"))}</label>
        <label class="pg-label">EMAIL ${inputField("email", str("email"))}</label>
      </div>
      <div class="pg-form-row">
        <label class="pg-label">COMPANY ${inputField("company", str("company"))}</label>
        <label class="pg-label">COUNTRY
          <select class="pg-input pg-select" data-field="country">
            ${countries.map(name => `<option${name === str("country") ? " selected" : ""}>${name}</option>`).join("")}
          </select>
        </label>
      </div>
      <fieldset class="pg-fieldset">
        <legend class="pg-label">ROLE</legend>
        <div class="pg-options">
          ${["Individual", "Team", "Student"]
            .map(
              option =>
                `<label class="pg-check"><input type="radio" name="role" data-field="role-${option.toLowerCase()}"${checked(
                  `role-${option.toLowerCase()}`
                )} /> ${option}</label>`
            )
            .join("")}
        </div>
      </fieldset>
      <fieldset class="pg-fieldset">
        <legend class="pg-label">INTERESTS</legend>
        <div class="pg-options">
          <label class="pg-check"><input type="checkbox" data-field="interests-updates"${checked(
            "interests-updates"
          )} /> Product updates</label>
          <label class="pg-check"><input type="checkbox" data-field="interests-research"${checked(
            "interests-research"
          )} /> Research</label>
          <label class="pg-check"><input type="checkbox" data-field="consent"${checked(
            "consent"
          )} /> I agree to the review terms</label>
        </div>
      </fieldset>
      <label class="pg-label pg-label-block">MESSAGE
        <textarea class="pg-input pg-textarea" data-field="message" rows="3">${escapeAttr(str("message"))}</textarea>
      </label>
      <div class="pg-form-row pg-sign-row">
        <label class="pg-label pg-signature-label">SIGNATURE ${inputField("signature", str("signature"))}</label>
        <label class="pg-label">DATE ${inputField("date", str("date"))}</label>
      </div>
      <div class="pg-form-foot">13 fields · values saved with the document</div>
    </form>
    <div class="pg-form-notes pg-two-col">
      <p class="pg-para">A filled form is still a page of type. The values are stored per field, not
      flattened into the artwork, so a reader can tab through them and an editor can clear them.</p>
      <p class="pg-para">The signature field is plain text here; a real document would carry a
      signature dictionary and a certificate alongside it.</p>
    </div>
    <div class="pg-form-legend">
      <div><span class="pg-note-label">TEXT FIELDS</span><p>Four single-line fields and one multi-line
      message; every value stays with the document.</p></div>
      <div><span class="pg-note-label">CHOICES</span><p>One country list, a three-way role group and
      three checkboxes for interests and consent.</p></div>
      <div><span class="pg-note-label">SIGN-OFF</span><p>Signature and date complete the thirteen
      interactive fields on this page.</p></div>
    </div>`;
  return sheet(page, body, "pg-page-form");
}

/* ------------------------------------------------------------------ field notes */

function checklistPage(page: Page): string {
  const items = [
    ["Pages trimmed to 8.5 × 11 in", true],
    ["Bleed marks inside the trim", true],
    ["All twelve script samples present", true],
    ["Colour chips converted to CMYK", false],
    ["Invoice totals reconciled with Q3", false],
    ["Signature block checked by legal", false]
  ] as const;
  const body = `
    <span class="pg-kicker">FIELD NOTES 01</span>
    <h2 class="pg-display">Site <em>checklist</em></h2>
    <p class="pg-standfirst">A small working page: tick boxes, notes and the things that are easier to
    catch on paper than on screen.</p>
    <ul class="pg-checklist">
      ${items
        .map(
          ([label, done]) =>
            `<li class="pg-check-row${done ? " done" : ""}"><span class="pg-check-box">${
              done ? "✓" : ""
            }</span><span>${label}</span></li>`
        )
        .join("")}
    </ul>
    <table class="pg-data-table pg-mini-table">
      <thead><tr><th>Item</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td>Trim check</td><td>LE</td><td>2 Oct</td><td class="pg-up">Done</td></tr>
        <tr><td>Colour proof</td><td>RO</td><td>3 Oct</td><td>Waiting</td></tr>
        <tr><td>Signature</td><td>PR</td><td>4 Oct</td><td>Waiting</td></tr>
      </tbody>
    </table>
    <div class="pg-note-block">
      <span class="pg-note-label">PRESS NOTE</span>
      <p>Run the checklist twice: once against the digital proof, once against the printed sheet.
      Anything that only fails on paper is a plate problem, not a type problem.</p>
    </div>`;
  return sheet(page, body, "pg-notes-page");
}

function invoicePage(page: Page): string {
  const rows = [
    ["Layout composition", "12 pages", "£2,400"],
    ["Type licensing review", "1 day", "£680"],
    ["Figure preparation", "18 figures", "£1,120"],
    ["Preflight & output", "2 runs", "£540"]
  ];
  const body = `
    <span class="pg-kicker">FIELD NOTES 02</span>
    <h2 class="pg-display">Invoice <em>2026-114</em></h2>
    <div class="pg-invoice-meta">
      <div><span>BILLED TO</span><p>Northwind Press<br/>14 Foundry Lane<br/>Bristol BS1 4TR</p></div>
      <div><span>DETAILS</span><p>Issued 2 Oct 2026<br/>Due 30 days<br/>VAT GB 214 8870 11</p></div>
    </div>
    <table class="pg-data-table pg-invoice-table">
      <thead><tr><th>Description</th><th>Qty</th><th>Amount</th></tr></thead>
      <tbody>
        ${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}
      </tbody>
    </table>
    <div class="pg-invoice-totals">
      <div><span>Subtotal</span><span>£4,740</span></div>
      <div><span>VAT 20%</span><span>£948</span></div>
      <div class="pg-invoice-total"><span>Total due</span><span>£5,688</span></div>
    </div>
    <p class="pg-table-note">Payment to PdfCraft Studio, account 40-11-22 · 2188 4471. Please quote
    invoice 2026-114.</p>
    <div class="pg-caption">An invoice is a table with a header and a total. Tabular figures make it
    read at a glance.</div>`;
  return sheet(page, body, "pg-invoice-page");
}

function termsPage(page: Page): string {
  const body = `
    <span class="pg-kicker">FIELD NOTES 03</span>
    <h2 class="pg-display">Terms &amp; <em>signature</em></h2>
    <p class="pg-standfirst">The page that turns a document into an agreement.</p>
    <ol class="pg-terms">
      <li><strong>Scope.</strong> The studio supplies composition, figure preparation and preflight for
      the pages listed in invoice 2026-114.</li>
      <li><strong>Approval.</strong> Two rounds of corrections are included. Further rounds are billed
      at the day rate.</li>
      <li><strong>Delivery.</strong> Final files are delivered as PDF/X-4 with fonts embedded and
      colour profiles attached.</li>
      <li><strong>Liability.</strong> The studio is not responsible for changes made after sign-off.</li>
    </ol>
    <div class="pg-signature-grid">
      <div class="pg-signature-box"><span>FOR NORTHWIND PRESS</span><div class="pg-sign-line"></div><em>Name &amp; date</em></div>
      <div class="pg-signature-box"><span>FOR PDFCRAFT STUDIO</span><div class="pg-sign-line pg-sign-ink">A. Lovelace</div><em>Name &amp; date</em></div>
    </div>
    <p class="pg-para">Signed copies should be returned as a searchable PDF, so the agreement can be
    found again without opening every file.</p>`;
  return sheet(page, body, "pg-terms-page");
}

function gridPage(page: Page): string {
  const body = `
    <span class="pg-kicker">FIELD NOTES 04</span>
    <h2 class="pg-display">Appendix: <em>work grid</em></h2>
    <p class="pg-standfirst">A page of graph paper, because some problems still want a pencil.</p>
    <div class="pg-graph"></div>
    <div class="pg-graph-notes">
      <div><span>COLUMNS</span><strong>12</strong></div>
      <div><span>GUTTER</span><strong>4 mm</strong></div>
      <div><span>BASELINE</span><strong>8 pt</strong></div>
      <div><span>MARGIN</span><strong>18 mm</strong></div>
    </div>`;
  return sheet(page, body, "pg-grid-page");
}

/* ------------------------------------------------------------------ registry */

export function renderPageContent(page: Page, doc: PdfDoc): string {
  activeBrand = brandFor(doc);
  if (page.blank) {
    return `<div class="pg-sheet pg-blank"><div class="pg-body"><span class="pg-blank-label">BLANK PAGE</span></div></div>`;
  }
  switch (page.kind) {
    case "cover":
      return coverPage();
    case "contents":
      return contentsPage(page);
    case "foreword":
      return forewordPage(page);
    case "chapter":
      return chapterPage(page);
    case "features":
      return featuresPage(page);
    case "expressive":
      return expressivePage(page);
    case "scripts":
      return scriptsPage(page);
    case "math":
      return mathPage(page);
    case "vector":
      return vectorPage(page);
    case "tables":
      return tablesPage(page);
    case "code":
      return codePage(page);
    case "markup":
      return markupPage(page);
    case "form":
      return formPage(page, doc);
    case "checklist":
      return checklistPage(page);
    case "invoice":
      return invoicePage(page);
    case "terms":
      return termsPage(page);
    case "grid":
      return gridPage(page);
    default:
      return sheet(page, `<h2 class="pg-display">${page.title}</h2>`);
  }
}

export function pageCaption(page: Page): string {
  return page.blank ? "Blank page" : page.title;
}
