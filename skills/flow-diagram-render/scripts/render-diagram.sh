#!/usr/bin/env bash
# Render one or more Mermaid .mmd files to 2x PNG on a white background.
# Usage: render-diagram.sh <file1.mmd> [file2.mmd ...]
#        render-diagram.sh assets/diagrams/*.mmd
# Output: <same-dir>/<same-name>.png next to each source.
# Pinned to mermaid-cli 11.17.0 so images match the Mermaid 11 used by the decision-doc template.
# Set MMDC_PUPPETEER_CONFIG to a JSON file (e.g. {"args":["--no-sandbox"]}) in Linux containers or CI.
set -uo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: render-diagram.sh <file.mmd> [more.mmd ...]" >&2
  exit 1
fi

MMDC=(npx -y @mermaid-js/mermaid-cli@11.17.0)
EXTRA=()
if [ -n "${MMDC_PUPPETEER_CONFIG:-}" ]; then EXTRA=(-p "$MMDC_PUPPETEER_CONFIG"); fi

failed=0
for src in "$@"; do
  if [ ! -f "$src" ]; then echo "skip (not found): $src" >&2; failed=$((failed + 1)); continue; fi
  out="${src%.mmd}.png"
  echo "rendering $src -> $out"
  if "${MMDC[@]}" -i "$src" -o "$out" -b white -s 2 ${EXTRA[@]+"${EXTRA[@]}"} --quiet; then
    echo "  done: $out"
  else
    echo "  failed: $src (see the error above)" >&2
    failed=$((failed + 1))
  fi
done

if [ "$failed" -gt 0 ]; then
  echo "$failed file(s) did not render." >&2
  exit 1
fi
