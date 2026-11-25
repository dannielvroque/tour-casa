#!/usr/bin/env python3
"""Reduz o peso das fotos de uma casa (precisa do Pillow:  pip install pillow).

Uso:  python tools/otimizar_fotos.py casas/minha-casa/fotos
- imagens 2:1 (panoramas 360): no máximo 4096 px de largura
- demais (fachada, fotos comuns): no máximo 2000 px de largura
- salva como JPG qualidade 84, no mesmo lugar (a original PNG/WEBP vira .jpg)
"""
import sys
from pathlib import Path
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
try:                                   # fotos de iPhone (.heic): pip install pillow-heif
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    pillow_heif = None
from PIL import ImageOps


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    pasta = Path(sys.argv[1])
    total_antes = total_depois = 0
    for f in sorted(pasta.iterdir()):
        if f.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp", ".heic"):
            continue
        if f.suffix.lower() == ".heic" and not pillow_heif:
            print(f"{f.name}: instale pillow-heif para ler HEIC"); continue
        antes = f.stat().st_size
        im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
        w, h = im.size
        # 2:1 = 360°; mais larga que 1,7:1 = panorâmica do celular (tipo 'cil'); o resto = foto comum
        limite = 4096 if abs(w / h - 2) < 0.05 else (6144 if w / h > 1.7 else 2400)
        if w > limite:
            im = im.resize((limite, round(h * limite / w)), Image.LANCZOS)
        destino = f.with_suffix(".jpg")
        im.save(destino, quality=84, optimize=True)
        if destino != f and f.suffix.lower() in (".png", ".webp"):
            f.unlink()                 # HEIC original é mantido (fica fora do git pelo .gitignore)
        depois = destino.stat().st_size
        total_antes += antes
        total_depois += depois
        print(f"{destino.name}: {antes/1e6:.1f} MB -> {depois/1e6:.1f} MB  ({im.size[0]}x{im.size[1]})")
    print(f"Total: {total_antes/1e6:.1f} MB -> {total_depois/1e6:.1f} MB")


if __name__ == "__main__":
    main()
