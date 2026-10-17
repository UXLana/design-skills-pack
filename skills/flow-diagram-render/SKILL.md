---
name: flow-diagram-render
description: Render Mermaid diagram sources to PNG/SVG image files for embedding where live Mermaid won't run — Confluence, Slack, slide decks, PDFs, email — with alt text for each image. Use whenever the user needs a flow/state/sequence diagram as an actual image file, wants to embed a diagram in Confluence (which has no native Mermaid), needs as-is + with-variant pairs of a flow rendered, or asks to "export the diagram", "turn this Mermaid into a PNG", "render the flow as an image". Pairs with requirements-to-decision-doc (source of the diagrams) and a Confluence mirror step, if you use one (consumer of the PNGs). Not for deciding what goes in the diagram (flow-capture, requirements-to-decision-doc).
---

# Flow Diagram Render

Turn Mermaid source into image files. The reason this is its own skill: tools like Confluence Cloud, Slack, and slide decks **cannot render Mermaid live**, so a diagram that's interactive in an HTML artifact has to become a static PNG/SVG to travel. Keeping the `.mmd` source alongside the image means the diagram stays version-controlled and re-renderable, not a frozen screenshot.

## Tool

`@mermaid-js/mermaid-cli` (`mmdc`), run through `npx`, **pinned to 11.17.0**. Verify with `npx -y @mermaid-js/mermaid-cli@11.17.0 -V`.

- **Why pinned:** Mermaid 12 (September 2026) re-lays out and recolors flowcharts and needs Node 22.13+. The decision-doc template renders with Mermaid 11, so images from 11.17.0 match what reviewers see in the hosted doc. Move both to 12 together, if ever, and keep the old look with `look: classic` and `layout: dagre` in the config.
- **First run is slow:** `npx` downloads the package into its cache, and Puppeteer downloads a headless Chrome. Nothing is installed into the project, but expect a few hundred MB and a minute or two the first time; later runs are fast.
- **Linux containers and CI** often can't start Chrome's sandbox. Pass a Puppeteer config: `-p puppeteer-config.json` containing `{"args": ["--no-sandbox"]}`.

## Workflow

1. **Collect the source(s).** Either Mermaid you already have, or extract the `<pre class="mermaid">` blocks from a decision-doc HTML. Save each as a `.mmd` file in an `assets/diagrams/` (or similar) folder so it lives next to its output.
2. **Sanitize for the CLI.** The browser tolerates HTML entities (`&mdash;`, `&#9314;`); the CLI does not parse all of them reliably. Replace entities with the literal character (`—`, `②`) in the `.mmd` file.
3. **Add a title and description** to each `.mmd` if it lacks them: an `accTitle:` line and an `accDescr:` line right after the diagram type. In an SVG they become the image's accessible title and description.
4. **Render** with the helper: `scripts/render-diagram.sh <file.mmd>` (or call `mmdc` directly — see below). Default to **PNG at 2× scale on a white background** for crisp embedding. If a render fails, the script prints the error; fix the source and re-run.
5. **Verify** by viewing the output image — confirm labels aren't clipped and color-coding survived. State machines with many transitions can place annotations far from their node; if it's unreadable, prefer the flowchart variant or simplify. Check that status is also readable without color (a legend line or status words in labels).
6. **Write the text alternative.** A PNG in Confluence, Slack, slides or email needs alt text (WCAG 2.2, 1.1.1). For each image, give the user a short alt text (what the diagram shows, in one sentence) and a one-paragraph text version of the flow to place beside it, since a long flow doesn't fit in alt text.
7. **Hand off.** Commit the PNGs so they're hosted (e.g. Vercel) and can be embedded by URL, or pass the paths and alt text to your Confluence mirror step, if you use one.

## As-is + variant pairs

When a flow has a proposed-layer variant (e.g. AI), render **both**: `02-assignment-flow.png` and `02b-assignment-flow-ai.png`. Use a stable naming scheme (`NN-name.png` / `NNb-name-variant.png`) so consumers can pair them.

## Direct command

```bash
npx -y @mermaid-js/mermaid-cli@11.17.0 -i <in.mmd> -o <out.png> -b white -s 2
```

- `-b white` — white background (transparent looks broken on most embeds).
- `-s 2` — 2× scale for retina-crisp output. Use `-o out.svg` for vector if the target supports it.
- For an SVG that will be opened in a design tool (Figma, Illustrator, Inkscape), pass `-c config.json` with `{"htmlLabels": false}`. HTML labels are drawn in `<foreignObject>`, which those tools drop, so the labels would vanish.

## Coloring variant nodes

Match the source artifact's conventions: color-code by lifecycle status, and draw proposed-layer (e.g. AI) nodes as **dashed advisory** nodes. For state diagrams, set note colors via an init directive so annotations match the layer color:

```
%%{init: {'themeVariables': {'noteBkgColor':'#f3e8ff','noteBorderColor':'#7c3aed','noteTextColor':'#4c1d95'}}}%%
```

## Reference

- `scripts/render-diagram.sh` — wrapper that renders one or many `.mmd` files to 2× PNG, prints any render error, and reports which files succeeded or failed.
