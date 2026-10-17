#!/usr/bin/env bash
# Render one or more Mermaid .mmd files to 2x PNG on a white background.
# Usage: render-diagram.sh <file1.mmd> [file2.mmd ...]
#        render-diagram.sh assets/diagrams/*.mmd
# Output: <same-dir>/<same-name>.png next to each source.
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: render-diagram.sh <file.mmd> [more.mmd ...]" >&2
  exit 1
fi

MMDC="npx -y @mermaid-js/mermaid-cli@latest"

for src in "$@"; do
  if [ ! -f "$src" ]; then echo "skip (not found): $src" >&2; continue; fi
  out="${src%.mmd}.png"
  echo "rendering $src -> $out"
  $MMDC -i "$src" -o "$out" -b white -s 2 >/dev/null 2>&1
  echo "  done: $out"
done
