#!/usr/bin/env bash
set -euo pipefail

# CLEANUP.sh — remove generated/temp files and artifact directories
# Run from the repository root: ./CLEANUP.sh

# Remove generated markdown/text artifacts
rm -f deepseek_markdown_20260615_*.md deepseek_text_20260615_*.txt gemini-code-*.md gemini-code-*.txt "Новый документ (6).pdf"

# Remove artifact directories (names contain emoji / special chars)
rm -rf "### 📂 FILE 4: `language" "📂 FILE 2: `language" "📂 FILE 3: language" "📂 FILE 5: language" "📂 FILE 6: language" "📂 FILE 7: language" "📂 ФИНАЛЬНОЕ ДЕРЕВО РЕПОЗИТОРИЯ language"

# Additional explicit removals (if present)
rm -f \
  deepseek_markdown_20260615_2dac7f.md \
  deepseek_markdown_20260615_a6e9ce.md \
  deepseek_markdown_20260615_efc8ea.md \
  deepseek_text_20260615_2f3995.txt \
  gemini-code-1781509723795.md \
  gemini-code-1781509900092.md \
  gemini-code-1781510617062.md \
  gemini-code-1781510949563.md \
  gemini-code-1781512877841.txt \
  gemini-code-1781514791712.md \
  gemini-code-1781514979395.txt \
  gemini-code-1781515306379.md \
  gemini-code-1781515377983.md \
  gemini-code-1781515443109.md \
  gemini-code-1781515487005.md \
  gemini-code-1781515545904.md \
  gemini-code-1781515614361.md \
  gemini-code-1781515762837.md \
  gemini-code-1781515825166.md \
  gemini-code-1781515900195.md \
  gemini-code-1781516780226.md \
  gemini-code-1781516842992.md \
  gemini-code-1781516906492.md \
  gemini-code-1781516957668.md \
  gemini-code-1781517012714.md \
  gemini-code-1781517055608.md \
  gemini-code-1781517114806.md \
  gemini-code-1781517673325.md \
  gemini-code-1781517709694.md \
  gemini-code-1781536543288.md \
  "AAM Language Kernel: French Core Entrypoint" \
  "Новый документ (6).pdf"

# Remove artifact directories (again, safer)
rm -rf "### 📂 FILE 4: `language" "📂 FILE 2: `language" "📂 FILE 3: language" "📂 FILE 5: language" "📂 FILE 6: language" "📂 FILE 7: language" "📂 ФИНАЛЬНОЕ ДЕРЕВО РЕПОЗИТОРИЯ language"

echo "Cleanup complete. Review git status and commit the removals as needed."
