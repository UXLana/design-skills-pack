---
name: flow-capture
description: Map a prototype against its requirements doc as a color-coded flow diagram. Every screen and feature is placed in its Crawl / Walk / Run (or MVP / Phase 2 / Phase 3) phase and marked built, missing, future or unverified, with a legend, and exported as an SVG, a one-page HTML and a print-ready PDF. Use when the user asks "what's built vs. missing?", "map the prototype against the requirements", "make a flow map", "screen map", "prototype map", "maturity map", "crawl walk run diagram", or wants to show stakeholders scope and gaps after a prototype build. Hands rendering to flow-diagram-render. Not for turning sync notes into a decision doc (requirements-to-decision-doc) or rendering a Mermaid file you already have (flow-diagram-render).
---

# flow-capture

Generate a visual flow map of a product prototype, color-coded by maturity phase (Crawl/Walk/Run). Synthesizes the requirements doc to decide what's built, what's missing, and what's future-phase, records the evidence for each call, then renders a Mermaid flowchart to SVG and PDF.

## When to use

- When documenting what a prototype covers vs. what's missing
- When communicating scope and maturity to stakeholders
- When mapping a requirements doc to a visual flow
- When answering "what's built, what's next?"
- After a prototype build finishes

## What it produces

| Output | Purpose |
|--------|---------|
| `flow-diagram.mmd` | The Mermaid source, kept so the map can be re-rendered |
| `flow-diagram.svg` | Rendered flowchart (no JavaScript needed; opens in design tools) |
| `flow-chart.html` | Self-contained page with the SVG, legend and evidence list |
| `<Project>-Flow-Map.pdf` | Print-ready PDF for stakeholders |

## Color coding

Every state has a color **and** a non-color cue (border style or a label suffix), so the map still reads in grayscale and for color-blind readers. Border colors are at least 3:1 against white (WCAG 2.2, 1.4.11).

| State | Meaning | Non-color cue | Mermaid classDef |
|-------|---------|---------------|-----------------|
| Crawl — built | In the requirements as Crawl and present in the prototype | Solid border | `fill:#dcfce7,stroke:#16a34a,color:#1f2937,rx:12,ry:12` |
| Crawl — missing | In the requirements as Crawl, not in the prototype | Dashed border + label ends "· not built" | `fill:#fef9c3,stroke:#a16207,color:#1f2937,stroke-dasharray:5 3,rx:12,ry:12` |
| Walk | Walk-phase feature | Inside the "Walk" subgraph | `fill:#dbeafe,stroke:#2563eb,color:#1f2937,rx:12,ry:12` |
| Run | Run-phase feature | Inside the "Run" subgraph | `fill:#fce7f3,stroke:#db2777,color:#1f2937,rx:12,ry:12` |
| Unverified | Crawl scope, but "built" couldn't be confirmed | Dotted border + label ends "· unverified" | `fill:#f1f5f9,stroke:#64748b,color:#1f2937,stroke-dasharray:2 2,rx:12,ry:12` |

Measured against white: `#16a34a` 3.30:1, `#a16207` 4.92:1, `#2563eb` 5.17:1, `#db2777` 4.60:1, `#64748b` 4.76:1. Edge lines use `#64748b` too. If you change a color, re-check it.

## Step-by-step workflow

### Step 1: Gather requirements

Use whatever the user gives you: a pasted doc, a file, or a link. If it's a Confluence or Notion link and a connector is available, fetch it; otherwise ask the user to paste or export it. Look for:
- **Phasing table** — what's Crawl vs. Walk vs. Run
- **Feature list** — every screen, flow, and capability
- **Gap analysis** — what exists in the prototype vs. what's missing
- **Out of scope** — what to exclude from the diagram

```
User says: "Map the onboarding prototype using these requirements"
Skill does: Reads the doc, reads the phasing, identifies gaps
```

### Step 2: Classify every screen, with evidence

Map each feature/screen to one of the five states above. "Built" needs evidence; record one of these per Crawl node:

| Evidence | Means |
|---|---|
| **Seen running** | You opened the prototype and reached the screen |
| **In code** | A route, page or component for it exists in the prototype repo |
| **Doc only** | Only the requirements doc's gap summary says it exists |

- Seen running or in code → **Crawl — built**.
- Doc only, or you can't reach the prototype or its code → **Unverified**. Don't promote it to built.
- In the requirements as Crawl and found nowhere → **Crawl — missing**.

Cross-reference the **Phasing Overview** table, the **Prototype Gap Summary** section (if available), and the actual prototype (running or in code) when you can access it.

### Step 3: Build the Mermaid diagram

Structure:
- **Main flow** at top — hub-and-spoke from Home/Dashboard
- **Linear flows** below — Registration, Checkout, etc.
- **Walk and Run** in labeled subgraphs at the bottom
- **Dashed arrows** (`-.->`) connect current screens to future phases

Rules:
- Start the source with `accTitle:` (the map's name) and `accDescr:` (one or two sentences: how many screens are built, missing, unverified, and in Walk/Run). They become the SVG's accessible title and description.
- Every node gets a classDef for its state
- Missing and unverified nodes get their label suffix ("· not built", "· unverified")
- Walk/Run subgraphs use `classDef` not subgraph styling
- Keep labels SHORT — max 3 words. No emoji in labels: screen readers read them aloud and they clutter a small map.
- Use `flowchart TD` (top-down) for vertical flow

### Step 4: Render to SVG (via flow-diagram-render)

Save the source as `flow-diagram.mmd` and this config as `flow-config.json`:

```json
{
  "theme": "base",
  "htmlLabels": false,
  "themeVariables": {
    "primaryColor": "#dcfce7",
    "primaryBorderColor": "#16a34a",
    "primaryTextColor": "#1f2937",
    "lineColor": "#64748b",
    "fontSize": "13px",
    "edgeLabelBackground": "#ffffff"
  },
  "flowchart": { "useMaxWidth": false, "curve": "basis", "padding": 8, "nodeSpacing": 30, "rankSpacing": 40 }
}
```

`htmlLabels: false` (at the root; the old `flowchart.htmlLabels` is deprecated) draws labels as SVG text instead of HTML inside `<foreignObject>`, which Figma-style SVG importers and Inkscape drop. Then render with the pinned CLI from `flow-diagram-render`:

```bash
npx -y @mermaid-js/mermaid-cli@11.17.0 -i flow-diagram.mmd -o flow-diagram.svg -c flow-config.json -b white
```

Open the SVG outside the browser (or in a design tool) and confirm the labels are there before delivering.

### Step 5: Build HTML wrapper

Generate `flow-chart.html` with:
- Title and metadata line (source doc and date)
- Legend: each swatch paired with its state name and its non-color cue
- Embedded SVG diagram (inline, so its `accTitle`/`accDescr` reach assistive tech)
- An evidence list: each Crawl screen with its state and evidence (seen running / in code / doc only)
- Source attribution
- No screenshots, no gallery, no tabs — just the map

### Step 6: Export PDF

Render the HTML to PDF with Playwright (`page.pdf`):
- A3 landscape, `scale: 0.9`
- Tight margins (`0.4in`)
- `printBackground: true`

### Step 7: Deliver

Put the outputs next to the requirements doc or in the project folder the user names, not in a scratch folder:

```
<project-folder>/
  <Project>-Flow-Map.pdf     ← for stakeholders
  flow-chart.html            ← for embedding
  flow-diagram.svg           ← for Confluence/Figma
  flow-diagram.mmd           ← to re-render later
```

## User interaction model

The user does NOT edit Mermaid or JSON. They talk:

```
User: "Map the onboarding prototype using these requirements"
Skill: Reads the doc, classifies with evidence, renders the diagram

User: "Remove Label Design — another product owns that now"
Skill: Removes node, re-renders

User: "Chat Panel should be Walk, not Crawl"
Skill: Recolors node, re-renders

User: "Add a Product Detail View — it's missing but it's Crawl scope"
Skill: Adds a dashed "· not built" node, re-renders
```

## Integration with other skills

| Skill or tool | Integration |
|-------|------------|
| `flow-diagram-render` | Renders the `.mmd` to SVG/PNG with the pinned Mermaid CLI |
| Your prototype build step | After a build, flow-capture maps what was built |
| Confluence/Notion requirements pages | Provide the requirements doc to synthesize from |
| Notion | Flow maps can be saved as Notion pages |

## Requirements document patterns

The skill looks for these patterns in requirements docs:

- **"Crawl / Walk / Run"** or **"MVP / Phase 2 / Phase 3"** — phasing
- **"Prototype Gap Summary"** — what's missing
- **"Not in Scope"** or **"Out of Scope"** — what to exclude
- **Feature tables** with complexity ratings (S/M/L/XL)
- **Entity models** — inform the flow hierarchy
- **User roles** — may inform permission-gated screens

## Limitations

- No screenshot capture and no "what changed since the last map" diff.
- For a FigJam board instead of an SVG, use the Figma MCP's diagram tool directly.
