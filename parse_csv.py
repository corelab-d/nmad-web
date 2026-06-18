#!/usr/bin/env python3
"""Parse Squarespace products CSV into structured JSON for NMAD site."""

import csv
import json
import re
import sys
from collections import defaultdict

CSV_PATH = "/Users/omarjkuri/Downloads/products_Jun-16_05-20-01PM.csv"

ARTIST_NORMALIZE = {
    'Carolina Tangasi': 'Carolina Tangassi',
    'Felipe Olivares': 'Felipe Olivares de los Ríos',
    'Virginia Urrustieta': 'Virginia Urreiztieta',
    'Ricahrd Budavari': 'Richard Budavari',
    'Deino López': 'David López "Deino"',
    'Jorge Sarquís Bello': 'Jorge Sarquis Bello',
    'Maria Portilla': 'María Portilla',
    'Pancha rodillo': 'Francisca Rodillo de Vicente',
}

def normalize_artist(name):
    import unicodedata
    name = unicodedata.normalize('NFC', name)
    return ARTIST_NORMALIZE.get(name, name)


def parse_description(html):
    """Extract technique, dimensions, year, edition from HTML description."""
    result = {}

    # Get plain-text lines preserving paragraph breaks
    lines_raw = re.split(r'</p>', html, flags=re.IGNORECASE)
    lines = []
    for l in lines_raw:
        t = re.sub(r'<[^>]+>', ' ', l)
        t = re.sub(r'&[a-zA-Z]+;', ' ', t)
        t = re.sub(r'\s+', ' ', t).strip()
        if t:
            lines.append(t)

    full_text = ' '.join(lines)

    # Format 1: labeled fields (Técnica: ..., Medidas: ..., etc.)
    patterns = {
        'technique': r'[Tt][eé]cnica\s*[:]\s*([^.\n]+)',
        'dimensions': r'[Mm]edida[s]?\s*[:]\s*([^.\n]+)',
        'year':       r'[Aa][ñn]o\s*[:]\s*([^.\n]+)',
        'edition':    r'[Oo]bra\s*[:]\s*([^.\n]+)',
        'framing':    r'[Mm]ontaje\s*[:]\s*([^.\n]+)',
    }
    for key, pattern in patterns.items():
        m = re.search(pattern, full_text)
        if m:
            result[key] = m.group(1).strip().rstrip('.')

    # Format 2: unlabeled lines — infer from content
    if not result.get('dimensions'):
        dim_pat = re.compile(r'^\d+[\.,]?\d*\s*[xX×]\s*\d+[\.,]?\d*\s*(?:cm|mm|m)?', re.IGNORECASE)
        for line in lines:
            if dim_pat.match(line.strip()):
                result['dimensions'] = line.strip()
                break

    if not result.get('technique'):
        dim_pat = re.compile(r'^\d+[\.,]?\d*\s*[xX×]', re.IGNORECASE)
        label_pat = re.compile(r'(técnica|medida|año|obra|montaje|precio)\s*:', re.IGNORECASE)
        skip_pat = re.compile(r'^\$[\d,]+|^\d{4}$')
        for line in lines:
            s = line.strip()
            if s and not dim_pat.match(s) and not label_pat.search(s) and not skip_pat.match(s) and len(s) > 3:
                result['technique'] = s
                break

    return result


def extract_artist_from_title(title):
    """Extract artist name from 'Artwork title - Artist Name' format."""
    parts = title.rsplit(' - ', 1)
    if len(parts) == 2:
        return parts[0].strip(), parts[1].strip()
    return title.strip(), None


def slugify(name):
    slug = name.lower()
    slug = re.sub(r'[áàä]', 'a', slug)
    slug = re.sub(r'[éèë]', 'e', slug)
    slug = re.sub(r'[íìï]', 'i', slug)
    slug = re.sub(r'[óòö]', 'o', slug)
    slug = re.sub(r'[úùü]', 'u', slug)
    slug = re.sub(r'[ñ]', 'n', slug)
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug


def parse_categories(cats_str):
    """Parse categories string like '/disponible, /vol-1' into list."""
    if not cats_str:
        return []
    cats = [c.strip().lstrip('/') for c in cats_str.split(',')]
    return [c for c in cats if c]


def main():
    artworks = []
    artists = {}  # slug -> {name, slug, artworks: []}

    with open(CSV_PATH, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            title_full = row.get('Title', '').strip()
            artwork_title, artist_name = extract_artist_from_title(title_full)

            if not artist_name:
                artist_name = ', '.join(row.get('Tags', '').split(',')[:1]).strip().title()

            artist_name = normalize_artist(artist_name)

            price_str = row.get('Price', '0').strip()
            try:
                price = float(price_str) if price_str else 0.0
            except ValueError:
                price = 0.0

            desc_html = row.get('Description', '')
            parsed = parse_description(desc_html)

            images_raw = row.get('Hosted Image URLs', '').strip()
            images = [img.strip() for img in images_raw.split(' ') if img.strip().startswith('http')]

            # Categorize images by filename hint (use only the filename, not full URL)
            image_full = None
            image_portada = None
            image_details = []
            image_sq = None
            for img in images:
                # Extract just the filename after the last /
                filename = img.split('/')[-1].lower()
                if 'portada' in filename:
                    image_portada = img
                elif 'full' in filename:
                    image_full = img
                elif 'sq' in filename or 'square' in filename:
                    image_sq = img
                else:
                    image_details.append(img)

            # Portada takes priority as main image; demote Full to details
            if image_portada:
                if image_full:
                    image_details = [image_full] + image_details
                image_full = image_portada
            elif not image_full and images:
                image_full = images[0]
                image_details = [img for img in image_details if img != image_full]

            categories = parse_categories(row.get('Categories', ''))
            available = 'disponible' in categories
            visible = row.get('Visible', 'No').strip() == 'Yes'

            artist_slug = slugify(artist_name) if artist_name else 'unknown'
            if artist_slug not in artists:
                artists[artist_slug] = {
                    'name': artist_name,
                    'slug': artist_slug,
                    'bio': '',
                    'artworks': []
                }

            artwork = {
                'id': row.get('Product ID [Non Editable]', '').strip(),
                'title': artwork_title,
                'slug': row.get('Product URL', '').strip(),
                'artist': artist_name,
                'artistSlug': artist_slug,
                'price': price,
                'available': available,
                'visible': visible,
                'technique': parsed.get('technique', ''),
                'dimensions': parsed.get('dimensions', ''),
                'year': parsed.get('year', ''),
                'edition': parsed.get('edition', 'Original'),
                'framing': parsed.get('framing', 'Sin Marco'),
                'collections': [c for c in categories if c != 'disponible'],
                'imageMain': image_full,
                'imageSquare': image_sq,
                'imageDetails': image_details,
                'allImages': images,
            }
            artworks.append(artwork)
            artists[artist_slug]['artworks'].append(artwork['id'])

    # Stats
    print(f"Total artworks: {len(artworks)}", file=sys.stderr)
    print(f"Total artists: {len(artists)}", file=sys.stderr)
    available_count = sum(1 for a in artworks if a['available'])
    print(f"Available: {available_count}", file=sys.stderr)

    output = {
        'artworks': artworks,
        'artists': list(artists.values()),
    }

    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
