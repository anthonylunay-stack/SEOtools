#!/usr/bin/env python3
"""Génère index.html (dashboard autonome) à partir de template.html et d'un flux JSON.

Usage :
    python3 build.py                                   # récupère le flux par défaut
    python3 build.py https://editobasecamp.vercel.app/flux-taxonomies
    python3 build.py chemin/vers/flux.json
    python3 build.py --seed                            # utilise data/seed.json (exemple)
"""
import json
import pathlib
import sys
import urllib.request

HERE = pathlib.Path(__file__).parent
DEFAULT_FEED = "https://editobasecamp.vercel.app/flux-taxonomies"


def load(src: str):
    if src == "--seed":
        return json.loads((HERE / "data" / "seed.json").read_text("utf-8")), False
    if src.startswith("http"):
        req = urllib.request.Request(src, headers={"Accept": "application/json", "User-Agent": "edito-taxonomy-dashboard"})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = json.loads(r.read().decode("utf-8"))
        (HERE / "data").mkdir(exist_ok=True)
        (HERE / "data" / "flux.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), "utf-8")
        return data, True
    return json.loads(pathlib.Path(src).read_text("utf-8")), True


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_FEED
    data, real = load(src)
    if real and isinstance(data, dict):
        data["__real"] = True
    elif real:
        data = {"items": data, "__real": True}
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    html = (HERE / "template.html").read_text("utf-8").replace("/*__SEED__*/", payload, 1)
    out = HERE / "index.html"
    out.write_text(html, "utf-8")
    print(f"{out} généré ({len(html) // 1024} Ko) depuis {src}")


if __name__ == "__main__":
    main()
