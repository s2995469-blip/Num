import * as THREE from "three";

/**
 * Procedural equirectangular texture for the carved numerology sphere.
 * One canvas drives both colour (soft tinted grooves) and bump (depth).
 * Nothing is downloaded.
 */
export function createSphereTextures(size = 2048) {
  const w = size;
  const h = size / 2;

  const make = () => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  };

  const draw = (ctx: CanvasRenderingContext2D, base: string, groove: string, deep: string) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // Fine latitude rings
    ctx.strokeStyle = groove;
    ctx.lineWidth = h * 0.0035;
    for (const lat of [0.3, 0.36, 0.64, 0.7]) {
      ctx.beginPath();
      ctx.moveTo(0, h * lat);
      ctx.lineTo(w, h * lat);
      ctx.stroke();
    }

    // Equatorial band of numerals 1–9, repeated around the sphere
    const band = h * 0.5;
    ctx.fillStyle = groove;
    ctx.font = `500 ${h * 0.05}px "Cormorant Garamond", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const count = 36;
    for (let i = 0; i < count; i++) {
      const x = ((i + 0.5) / count) * w;
      // Leave room for the large 7 on the front face.
      if (Math.abs(x - w * 0.25) < w * 0.09) continue;
      ctx.fillText(String((i % 9) + 1), x, band);
    }

    // Meridian ticks
    ctx.lineWidth = h * 0.002;
    for (let i = 0; i < 72; i++) {
      const x = (i / 72) * w;
      ctx.beginPath();
      ctx.moveTo(x, h * 0.315);
      ctx.lineTo(x, h * (i % 2 ? 0.33 : 0.345));
      ctx.moveTo(x, h * 0.685);
      ctx.lineTo(x, h * (i % 2 ? 0.67 : 0.655));
      ctx.stroke();
    }

    // The carved 7 on the front face (u = 0.25 faces +Z in three.js)
    ctx.fillStyle = deep;
    ctx.font = `500 ${h * 0.24}px "Cormorant Garamond", Georgia, serif`;
    ctx.save();
    // At the equator an equirectangular map has equal pixels-per-radian on
    // both axes, so the numeral needs no aspect compensation.
    ctx.translate(w * 0.25, band + h * 0.01);
    ctx.fillText("7", 0, 0);
    ctx.restore();

    // Ring circling the 7
    ctx.strokeStyle = groove;
    ctx.lineWidth = h * 0.0035;
    ctx.save();
    ctx.translate(w * 0.25, band);
    ctx.beginPath();
    ctx.arc(0, 0, h * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  const colorCanvas = make();
  draw(colorCanvas.getContext("2d")!, "#efe8da", "#cdbd9f", "#b49f7c");
  const bumpCanvas = make();
  draw(bumpCanvas.getContext("2d")!, "#ffffff", "#5a5a5a", "#202020");

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.anisotropy = 4;
  return { map, bumpMap };
}
