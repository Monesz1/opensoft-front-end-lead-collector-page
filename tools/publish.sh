#!/usr/bin/env bash
# Publish the built static site to the gh-pages branch WITHOUT GitHub Actions.
#
# This account's GitHub-hosted runners are unavailable, so the deploy.yml
# workflow can never run. This script does the same job from a workstation:
# build the pages from content/, assemble only the public files, and push them
# to gh-pages. GitHub Pages then serves that branch (branch serving does not
# need your Actions runners).
#
# Usage:  bash tools/publish.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DOMAIN="www.opensoft.hu"        # keep in sync with the CNAME file / Pages custom domain
PUB=(index.html about.html contact.html gdpr.html privacy.html assets i18n pages)

echo "1/4  building pages from content/ ..."
python tools/build_pages.py >/dev/null

echo "2/4  preparing an isolated gh-pages worktree ..."
git fetch -q origin
WT="$ROOT/.ghpages-worktree"
git worktree remove --force "$WT" 2>/dev/null || true
rm -rf "$WT"
if git show-ref --verify -q refs/remotes/origin/gh-pages; then
  git worktree add -q -B gh-pages "$WT" origin/gh-pages
else
  git worktree add -q -b gh-pages "$WT"    # first publish: branch off current HEAD
  ( cd "$WT" && git rm -rq -f . >/dev/null 2>&1 || true )
fi

echo "3/4  copying the public files (internal folders stay private) ..."
( cd "$WT" && git rm -rq -f . >/dev/null 2>&1 || true )
cp -r "${PUB[@]}" "$WT"/
if [ -f CNAME ]; then cp CNAME "$WT"/CNAME; else printf '%s\n' "$DOMAIN" > "$WT"/CNAME; fi
: > "$WT"/.nojekyll

echo "4/4  commit + push gh-pages ..."
SHA="$(git rev-parse --short HEAD)"
(
  cd "$WT"
  git add -A
  if git diff --cached --quiet; then
    echo "   gh-pages already up to date — nothing to push"
  else
    git commit -q -m "publish: main@$SHA"
    git push -q origin gh-pages
    echo "   pushed gh-pages (main@$SHA)"
  fi
)
git worktree remove --force "$WT"
echo "done."
