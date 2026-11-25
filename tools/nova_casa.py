#!/usr/bin/env python3
"""Cria uma casa nova a partir de casas/_modelo e a registra em casas/casas.js.

Uso:  python tools/nova_casa.py praia "Casa de Praia" ["descricao curta"]
"""
import json, re, shutil, sys
from pathlib import Path

raiz = Path(__file__).resolve().parent.parent
casas = raiz / "casas"


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    cid, nome = sys.argv[1], sys.argv[2]
    desc = sys.argv[3] if len(sys.argv) > 3 else ""
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", cid):
        sys.exit("O id deve ter só letras minúsculas, números e hífen (ex.: casa-praia).")
    destino = casas / cid
    if destino.exists():
        sys.exit(f"Já existe {destino}.")
    shutil.copytree(casas / "_modelo", destino)
    cfg = destino / "config.js"
    cfg.write_text(cfg.read_text(encoding="utf-8").replace("__NOME__", nome), encoding="utf-8")

    reg = casas / "casas.js"
    txt = reg.read_text(encoding="utf-8")
    linha = "  { id: %s, nome: %s, descricao: %s, capa: 'fotos/fachada.jpg' },\n" % (
        json.dumps(cid), json.dumps(nome, ensure_ascii=False), json.dumps(desc, ensure_ascii=False))
    i = txt.rindex("];")
    reg.write_text(txt[:i] + linha + txt[i:], encoding="utf-8")
    print(f"Casa criada em {destino}\nAbra: ?casa={cid}\nPróximo passo: colocar as fotos em {destino / 'fotos'} e editar {cfg}")


if __name__ == "__main__":
    main()
