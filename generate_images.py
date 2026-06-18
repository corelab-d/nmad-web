#!/usr/bin/env python3
"""
Generate missing artwork images using Vertex AI (Gemini on Google Cloud).
Uses Google Cloud billing credits, not AI Studio prepay credits.

For each artwork with <= 2 images generates:
  sala.jpg     — artwork mounted in a modern living room
  detalle1.jpg — close-up detail of the artwork
  detalle2.jpg — different close-up detail

Setup (one time):
  gcloud auth application-default login
  gcloud config set project corelab-platform

Usage:
  python3 generate_images.py --slug mi-obra     # single artwork
  python3 generate_images.py                    # all with <= 2 images
  python3 generate_images.py --dry-run          # preview only
"""

import argparse
import json
import os
import ssl
import sys
import time
import urllib.request
from pathlib import Path

import vertexai
from vertexai.generative_models import GenerativeModel, Part, GenerationConfig

# ── Config ────────────────────────────────────────────────────────────────────

CATALOG_PATH  = Path(__file__).parent / "data" / "catalog.json"
OUTPUT_BASE   = Path(__file__).parent / "public" / "generated"
GCP_PROJECT   = "corelab-platform"
GCP_LOCATION  = "us-central1"
MODEL         = "gemini-2.0-flash-exp"
MAX_IMAGES    = 2
DELAY_SECONDS = 5

# ── Helpers ───────────────────────────────────────────────────────────────────

def init_vertex():
    vertexai.init(project=GCP_PROJECT, location=GCP_LOCATION)
    return GenerativeModel(MODEL)

def download_image(url: str) -> bytes:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
        return r.read()

def save_bytes(data: bytes, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    print(f"  ✓ Saved {path.relative_to(Path(__file__).parent)}")

# ── Prompt builder ────────────────────────────────────────────────────────────

def build_prompt(artwork: dict, img_type: str) -> str:
    dims      = artwork.get("dimensions", "")
    artist    = artwork.get("artist", "")
    technique = artwork.get("technique", "")

    dim_note = f"La obra mide {dims}." if dims else ""
    context  = f"Artista: {artist}. Técnica: {technique}. {dim_note}".strip()

    if img_type == "sala":
        return (
            f"Esta es una obra de arte original. {context} "
            "Genera una fotografía fotorrealista de alta calidad mostrando esta obra "
            "montada en la pared de una sala moderna y elegante con luz natural suave. "
            "El cuadro debe verse completo, con la textura y colores originales preservados. "
            "Sin texto, sin logos, sin marcas de agua."
        )
    if img_type == "detalle1":
        return (
            f"Esta es una obra de arte original. {context} "
            "Genera un acercamiento fotorrealista a un detalle interesante de esta obra: "
            "una zona con textura, color o trazo llamativo que llene el encuadre. "
            "Sin texto, sin logos."
        )
    if img_type == "detalle2":
        return (
            f"Esta es una obra de arte original. {context} "
            "Genera un acercamiento fotorrealista a un detalle DIFERENTE al anterior: "
            "otra zona distinta con textura, trazo o composición que llene el encuadre. "
            "Sin texto, sin logos."
        )
    return ""

# ── Core ──────────────────────────────────────────────────────────────────────

def generate_one(model, image_bytes: bytes, prompt: str) -> bytes | None:
    image_part = Part.from_data(data=image_bytes, mime_type="image/jpeg")
    response = model.generate_content(
        [image_part, prompt],
        generation_config=GenerationConfig(
            response_modalities=["IMAGE", "TEXT"]
        ),
    )
    for candidate in response.candidates:
        for part in candidate.content.parts:
            if hasattr(part, '_raw_part') and part._raw_part.inline_data.data:
                return part._raw_part.inline_data.data
            if hasattr(part, 'inline_data') and part.inline_data and part.inline_data.data:
                return part.inline_data.data
    return None

def process_artwork(artwork: dict, model, dry_run: bool) -> dict:
    slug       = artwork["slug"]
    image_main = artwork.get("imageMain")
    if not image_main:
        print("  ⚠ No imageMain — skipping")
        return artwork

    out_dir   = OUTPUT_BASE / slug
    new_paths = []

    for img_type in ["sala", "detalle1", "detalle2"]:
        out_path = out_dir / f"{img_type}.jpg"
        web_path = f"/generated/{slug}/{img_type}.jpg"

        if out_path.exists():
            print(f"  · {img_type}.jpg already exists")
            if web_path not in artwork.get("imageDetails", []):
                new_paths.append(web_path)
            continue

        if dry_run:
            print(f"  → Would generate {img_type}.jpg")
            continue

        print(f"  → Generating {img_type}.jpg …", end=" ", flush=True)
        try:
            image_bytes = download_image(image_main)
            prompt      = build_prompt(artwork, img_type)
            result      = generate_one(model, image_bytes, prompt)
            if result:
                save_bytes(result, out_path)
                new_paths.append(web_path)
            else:
                print("✗ No image in response")
        except Exception as e:
            print(f"✗ {e}")

        time.sleep(DELAY_SECONDS)

    if new_paths:
        existing = artwork.get("imageDetails", [])
        artwork["imageDetails"] = existing + [p for p in new_paths if p not in existing]

    return artwork

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug",       help="Process only this artwork slug")
    parser.add_argument("--dry-run",    action="store_true")
    parser.add_argument("--max-images", type=int, default=MAX_IMAGES)
    args = parser.parse_args()

    catalog  = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    artworks = catalog["artworks"]

    if args.slug:
        targets = [a for a in artworks if a["slug"] == args.slug]
        if not targets:
            sys.exit(f"No artwork with slug '{args.slug}'")
    else:
        targets = [
            a for a in artworks
            if a.get("visible") and a.get("imageMain")
            and (1 + len(a.get("imageDetails", []))) <= args.max_images
        ]

    print(f"{'[DRY RUN] ' if args.dry_run else ''}Processing {len(targets)} artworks\n")

    model   = None if args.dry_run else init_vertex()
    updated = 0

    for i, artwork in enumerate(targets, 1):
        print(f"[{i}/{len(targets)}] {artwork['title']} — {artwork['artist']}")
        old_details = list(artwork.get("imageDetails", []))
        artwork = process_artwork(artwork, model, args.dry_run)

        for j, a in enumerate(artworks):
            if a["slug"] == artwork["slug"]:
                catalog["artworks"][j] = artwork
                break

        if artwork.get("imageDetails", []) != old_details:
            updated += 1

    if not args.dry_run:
        CATALOG_PATH.write_text(
            json.dumps(catalog, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
        print(f"\n✓ Done — {updated} artworks updated in catalog.json")
    else:
        print("\n(Dry run complete — nothing written)")

if __name__ == "__main__":
    main()
