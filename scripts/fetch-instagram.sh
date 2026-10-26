#!/usr/bin/env bash
# Scarica le foto del profilo IG come materiale di lavoro/moodboard.
# Fallo solo con l'ok della cliente (è il suo profilo).
# Usa il login: in anonimo Instagram blocca dopo poche richieste.
# Uso: bash scripts/fetch-instagram.sh TUO_USERNAME_IG
set -euo pipefail

PROFILE="jeanneblue.ink"
LOGIN="${1:-}"
OUT="assets-raw/instagram"

if ! command -v instaloader >/dev/null 2>&1; then
  echo "Installo instaloader..."
  python3 -m pip install --user instaloader || pipx install instaloader
fi

ARGS=(
  --no-videos
  --no-video-thumbnails
  --no-metadata-json
  --no-compress-json
  --no-profile-pic
  --dirname-pattern "$OUT"
  --filename-pattern "{date_utc:%Y-%m-%d}_{shortcode}"
  --fast-update
)

if [[ -n "$LOGIN" ]]; then
  ARGS+=(--login "$LOGIN")
else
  echo "⚠  Nessun login: potrebbe fermarsi presto. Passa il tuo username IG come argomento."
fi

instaloader "${ARGS[@]}" "$PROFILE"

echo
echo "Fatto. Le didascalie (.txt) sono accanto alle foto."
echo "Smista a mano in assets-raw/tatuaggi e assets-raw/dipinti."
