---
name: flow-capture
description: Generate color-coded flow diagrams from UX requirements documents. Maps every screen and feature to Crawl/Walk/Run maturity phases with visual indicators for what's built vs. missing.
triggers:
  - /flow-capture
  - flow diagram
  - flow map
  - crawl walk run
  - prototype map
  - screen map
  - what's built
  - maturity map
deploy:
  - claude_ai
  - claude_code
  - cowork
---

# flow-capture

Generate visual flow maps of product prototypes, color-coded by maturity phase (Crawl/Walk/Run). Synthesizes requirements from Confluence/Notion specs to determine what's built, what's missing, and what's future-phase — then renders a clean Mermaid flowchart as pre-rendered SVG with PDF export.

## When to use

- When documenting what a prototype covers vs. what's missing
- When communicating scope and maturity to stakeholders
- When mapping a requirements doc to a visual flow
- When answering "what's built, what's next?"
- After a prototype build finishes

## What it produces

| Output | Purpose |
|--------|---------|
| `flow-diagram.svg` | Pre-rendered Mermaid flowchart (no JS dependency) |
| `flow-chart.html` | Self-contained HTML page with SVG + legend |
| `*-Flow-Map.pdf` | Print-ready PDF for stakeholders |

## Color coding

| Color | Meaning | Mermaid classDef |
|-------|---------|-----------------|
| 🟢 Green solid | Crawl — prototyped | `fill:#dcfce7,stroke:#16a34a,rx:12,ry:12` |
| 🟡 Yellow dashed | Crawl — not yet built | `fill:#fef9c3,stroke:#ca8a04,stroke-dasharray:5 3,rx:12,ry:12` |
| 🔵 Blue solid | Walk phase | `fill:#dbeafe,stroke:#2563eb,rx:12,ry:12` |
| 🩷 Pink solid | Run phase | `fill:#fce7f3,stroke:#db2777,rx:12,ry:12` |

All nodes use `rx:12,ry:12` for rounded corners.

## Step-by-step workflow

### Step 1: Gather requirements

Fetch the UX requirements document from Confluence or Notion. Look for:
- **Phasing table** — what's Crawl vs. Walk vs. Run
- **Feature list** — every screen, flow, and capability
- **Gap analysis** — what exists in the prototype vs. what's missing
- **Out of scope** — what to exclude from the diagram

```
User says: "Map the onboarding prototype using the Confluence requirements"
Skill does: Fetches the Confluence page, reads phasing, identifies gaps
```

### Step 2: Classify every screen

Map each feature/screen to one of four states:

1. **Crawl — Prototyped** (green): In the requirements as Crawl AND exists in the prototype
2. **Crawl — Missing** (yellow dashed): In the requirements as Crawl but NOT yet prototyped
3. **Walk** (blue): Walk-phase features
4. **Run** (pink): Run-phase features

Cross-reference:
- The **Phasing Overview** table in the requirements doc
- The **Prototype Gap Summary** section (if available)
- The actual running prototype (if accessible)

### Step 3: Build the Mermaid diagram

Structure:
- **Main flow** at top — hub-and-spoke from Home/Dashboard
- **Linear flows** below — Registration, Checkout, etc.
- **Walk and Run** in labeled subgraphs at the bottom
- **Dashed arrows** (`-.->`) connect current screens to future phases

Rules:
- Every node gets a classDef for its maturity color
- Missing Crawl screens use `stroke-dasharray:5 3` (dashed borders)
- Walk/Run subgraphs use `classDef` not subgraph styling
- Keep labels SHORT — max 3 words + emoji
- Use `flowchart TD` (top-down) for vertical flow
- Set `padding:8,nodeSpacing:30,rankSpacing:40` for tight layout (no wasted space)

### Step 4: Render to SVG

Use Playwright to pre-render the Mermaid diagram — zero client-side JS dependency.

```javascript
// render-mermaid.mjs
import mermaid from "mermaid@11";
mermaid.initialize({
  theme: "base",
  themeVariables: {
    primaryColor: "#dcfce7",
    primaryBorderColor: "#16a34a",
    lineColor: "#94a3b8",
    fontSize: "13px",
    edgeLabelBackground: "#ffffff"
  },
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
    curve: "basis",
    padding: 8,
    nodeSpacing: 30,
    rankSpacing: 40
  }
});
```

Output: `flow-diagram.svg` — portable, embeddable anywhere.

### Step 5: Build HTML wrapper

Generate `flow-chart.html` with:
- Title and metadata line
- Color legend (4 swatches with labels)
- Embedded SVG diagram
- Source attribution
- No screenshots, no gallery, no tabs — just the map

### Step 6: Export PDF

Render HTML to PDF via Playwright:
- A3 landscape, `scale: 0.9`
- Tight margins (`0.4in`)
- Print background colors
- Copy to user's preferred location

### Step 7: Deliver

```
User gets:
  <project-folder>/Project-Flow-Map.pdf              ← for stakeholders
  screenshots/flow-chart.html                          ← for embedding
  screenshots/flow-diagram.svg                         ← for Confluence/Figma
```

## User interaction model

The user does NOT edit Mermaid or JSON. They talk:

```
User: "Map the onboarding prototype using the Confluence requirements"
Skill: Fetches Confluence, synthesizes, renders diagram

User: "Remove Label Design — another product owns that now"
Skill: Removes node, re-renders

User: "Chat Panel should be Walk, not Crawl"
Skill: Recolors node, re-renders

User: "Add a Product Detail View — it's missing but it's Crawl scope"
Skill: Adds yellow-dashed node, re-renders
```

## Integration with other skills

| Skill or tool | Integration |
|-------|------------|
| Your prototype build step | After a build, flow-capture maps what was built |
| Confluence/Notion requirements pages | Provide the requirements doc to synthesize from |
| Your design-system workflow | Flow maps can include component-level screens |
| Notion | Flow maps can be saved as Notion pages |

## Requirements document patterns

The skill looks for these patterns in Confluence/Notion docs:

- **"Crawl / Walk / Run"** or **"MVP / Phase 2 / Phase 3"** — phasing
- **"Prototype Gap Summary"** — what's missing
- **"Not in Scope"** or **"Out of Scope"** — what to exclude
- **Feature tables** with complexity ratings (S/M/L/XL)
- **Entity models** — inform the flow hierarchy
- **User roles** — may inform permission-gated screens

## Known limitations (v1)

- No automated screenshot capture — user handles screenshots separately
- No FigJam export — use `generate_diagram` MCP tool directly
- No diff between versions (no "what changed since last map")
- Mermaid rendering requires Playwright + CDN access for initial render
