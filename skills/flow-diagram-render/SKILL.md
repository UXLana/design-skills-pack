---
name: flow-diagram-render
description: Render Mermaid diagram sources to PNG/SVG image files for embedding where live Mermaid won't run — Confluence, Slack, slide decks, PDFs, email. Use whenever the user needs a flow/state/sequence diagram as an actual image file, wants to embed a diagram in Confluence (which has no native Mermaid), needs as-is + with-variant pairs of a flow rendered, or asks to "export the diagram", "turn this Mermaid into a PNG", "render the flow as an image". Pairs with requirements-to-decision-doc (source of the diagrams) and a Confluence mirror step, if you use one (consumer of the PNGs).
---

# Flow Diagram Render

Turn Mermaid source into image files. The reason this is its own skill: tools like Confluence Cloud, Slack, and slide decks **cannot render Mermaid live**, so a diagram that's interactive in an HTML artifact has to become a static PNG/SVG to travel. Keeping the `.mmd` source alongside the image means the diagram stays version-controlled and re-renderable, not a frozen screenshot.

## Tool

`@mermaid-js/mermaid-cli` (`mmdc`), run via `npx` — no install needed. Verify with `npx -y @mermaid-js/mermaid-cli@latest -V`.

## Workflow

1. **Collect the source(s).** Either Mermaid you already have, or extract the `<pre class="mermaid">` blocks from a decision-doc HTML. Save each as a `.mmd` file in an `assets/diagrams/` (or similar) folder so it lives next to its output.
2. **Sanitize for the CLI.** The browser tolerates HTML entities (`&mdash;`, `&#9314;`); the CLI does not parse all of them reliably. Replace entities with the literal character (`—`, `②`) in the `.mmd` file.
3. **Render** with the helper: `scripts/render-diagram.sh <file.mmd>` (or call `mmdc` directly — see below). Default to **PNG at 2× scale on a white background** for crisp embedding.
4. **Verify** by viewing the output image — confirm labels aren't clipped and color-coding survived. State machines with many transitions can place annotations far from their node; if it's unreadable, prefer the flowchart variant or simplify.
5. **Hand off.** Commit the PNGs so they're hosted (e.g. Vercel) and can be embedded by URL, or pass the paths to your Confluence mirror step, if you use one.

## As-is + variant pairs

When a flow has a proposed-layer variant (e.g. AI), render **both**: `02-assignment-flow.png` and `02b-assignment-flow-ai.png`. Use a stable naming scheme (`NN-name.png` / `NNb-name-variant.png`) so consumers can pair them.

## Direct command

```bash
npx -y @mermaid-js/mermaid-cli@latest -i <in.mmd> -o <out.png> -b white -s 2
```

- `-b white` — white background (transparent looks broken on most embeds).
- `-s 2` — 2× scale for retina-crisp output. Use `-o out.svg` for vector if the target supports it.

## Coloring variant nodes

Match the source artifact's conventions: color-code by lifecycle status, and draw proposed-layer (e.g. AI) nodes as **dashed advisory** nodes. For state diagrams, set note colors via an init directive so annotations match the layer color:

```
%%{init: {'themeVariables': {'noteBkgColor':'#f3e8ff','noteBorderColor':'#7c3aed','noteTextColor':'#4c1d95'}}}%%
```

## Reference

- `scripts/render-diagram.sh` — wrapper that renders one or many `.mmd` files to 2× PNG and reports output paths.
