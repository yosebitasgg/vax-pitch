# VAX Pitch · 10 min · Editorial Edition

Magazine-style HTML deck. Paper cream + ink purple + gold. Fraunces serif + Caveat handwriting + JetBrains Mono. SVG drawing animations + typewriter on hero/close. Canvas fijo 1920×1080 escalado al viewport.

## Cómo abrirlo

**Servidor local (recomendado):**
```bash
cd pitch && python3 -m http.server 8080
# luego http://localhost:8080
```

**Directo:**
```bash
open index.html
```

## Atajos durante la presentación

| Tecla | Acción |
|---|---|
| `→` `Space` `PageDown` | Siguiente capítulo |
| `←` `PageUp` | Capítulo anterior |
| `Home` / `End` | Primer / último |
| `F` | Toggle fullscreen |
| Click derecho de pantalla | Avanzar |
| Click izquierdo | Retroceder |
| Click en dots inferiores | Saltar |

## Checklist pre-pitch

- [ ] Cargar la página entera antes de presentar (cachea fonts + GSAP)
- [ ] `F` para fullscreen
- [ ] Cronometrar lectura: 10 min total, ~1:15 por capítulo
- [ ] Plan B en PDF: `Cmd+P` → "Guardar como PDF" (motion se pierde, contenido queda)
- [ ] Verificar en proyector real una vez (los morados pueden verse más oscuros bajo luz ambiente)

## Estructura

```
pitch/
├── index.html                  # 8 capítulos, canvas 1920×1080
├── styles/
│   ├── main.css                # Tokens VAX · paper · typography · canvas scaler
│   ├── sections.css            # Layouts editoriales por capítulo
│   └── motion.css              # Estados iniciales para GSAP
├── scripts/
│   ├── gsap.min.js             # Self-hosted
│   ├── typewriter.js           # Split-text con word-nowrap
│   ├── counters.js             # Count-up serif
│   ├── timeline.js             # Timelines + SVG path drawing
│   ├── nav.js                  # Teclado + dots
│   └── main.js                 # Scaling 16:9 + bootstrap
├── assets/
│   ├── fonts/                  # Fraunces (recta + itálica), Caveat, JBMono
│   ├── icons/                  # Lucide (truck, map, compass, package, etc.)
│   ├── maps/
│   │   ├── world.svg           # Mapa mundi SVG completo (referencia)
│   │   └── northamerica.svg    # MX + US extraídos para inline en HTML
│   ├── vax-logo.png
│   └── vax-mark.png
└── data/
    ├── metrics.json
    └── routes.json
```

## Capítulos

| # | Título | Duración |
|---|---|---|
| 01 | Apertura (cover) | 1:00 |
| 02 | El dolor (cap. I) | 1:30 |
| 03 | La geografía manda (cap. II) | 1:00 |
| 04 | La caja (cap. III) | 1:00 |
| 05 | Lo que prometemos (cap. IV) | 3:00 |
| 06 | El método (cap. V) | 1:00 |
| 07 | Lo que sigue (cap. VI) | 0:30 |
| 08 | Coda (cierre) | 0:30 |

## Diseño

**Paleta** — extraída del brand kit oficial VAX:
- Paper: `#F2EBDA` (warm cream)
- Ink: `#1A0D35` (deep purple)
- Purple accent: `#5A1E96`
- Gold accent: `#B8861A`

**Tipografía:**
- Display + body: Fraunces variable serif (recta e itálica)
- Hand annotations: Caveat (cursiva manuscrita)
- Tech labels: JetBrains Mono

**Animaciones:**
- **Typewriter** en hero + tagline de cierre (palabras envueltas en spans con `white-space: nowrap` para no romper a media palabra)
- **SVG path drawing** para mapa MX-US, rutas, arrows, ornamentos
- **Underline drawing** golden bajo frases clave
- **Count-up** con números en serif
- **Drop cap** en párrafos editoriales

**Blindaje vigente:**
- Cero menciones de `LightGBM`, `target encoding`, `conformal`, `bayesiano`, `Google Distance Matrix`, `pgvector`, `Mapbox`, `RAG`, `Claude`, `MCP`, `CLI`, `agente`.
- Solo el motor se muestra como caja negra. Métricas + categorías de features sí se enseñan.

## Ediciones rápidas

- Cambiar métricas → texto en `index.html` (count-up vive como `data-from` / `data-to` / `data-decimals`)
- Cambiar rutas del mapa → `routes.json` y paths SVG inline en el slide de Insight
- Tweak de colores → `:root` en `styles/main.css`
- Cifras citadas (90h, 78%, 87.2%) están en `data/metrics.json` y como texto en el HTML

## Créditos

- Mapa: extraído de [flekschas/simple-world-map](https://github.com/flekschas/simple-world-map) — CC BY-SA 3.0, Al MacDonald
- Icons: [Lucide](https://lucide.dev) — ISC
- Fuentes: Fraunces, Caveat, JetBrains Mono (OFL via Fontsource)
