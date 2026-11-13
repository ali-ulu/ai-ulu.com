// GLSL ES 1.00, so the same source runs on WebGL 2 and on the WebGL 1 fallback.
// Colour is written premultiplied (the renderer is created with premultipliedAlpha).

export const vertex = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const roundBox = /* glsl */ `
float roundBox(vec2 p, vec2 hs, float r) {
  vec2 q = abs(p) - hs + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}`;

// A sheet: a rounded rectangle cut from a quad, textured with its artboard.
// uFlat = 1 draws the same shape in a flat tint (the slab's edge).
export const sheetFragment = /* glsl */ `
precision highp float;
uniform sampler2D tMap;
uniform vec2 uSize;
uniform float uRadius, uDim, uSheen, uFlat;
uniform vec3 uTint;
varying vec2 vUv;
${roundBox}
void main() {
  float d = roundBox((vUv - 0.5) * uSize, uSize * 0.5, uRadius);
  float a = 1.0 - smoothstep(-0.012, 0.012, d);
  vec3 c = mix(texture2D(tMap, vUv).rgb, uTint, uFlat);
  // A band of light that crosses the sheet as the film advances.
  float band = 1.0 - abs(vUv.x + vUv.y * 0.6 - uSheen * 2.4 + 0.4) * 3.2;
  c += smoothstep(0.0, 1.0, band) * 0.09 * (1.0 - uFlat);
  // Lit top edge, so the slab reads as a solid.
  c += smoothstep(-0.04, -0.008, d) * 0.07 * (1.0 - uFlat);
  c *= uDim;
  gl_FragColor = vec4(c * a, a);
}`;

// A soft rounded-box falloff: the contact shadow under a sheet, or (uAdd = 1)
// the pool of warm light on the floor, added rather than blended.
export const shadowFragment = /* glsl */ `
precision highp float;
uniform vec2 uSize, uBox;
uniform float uBlur, uOpacity, uAdd;
uniform vec3 uColor;
varying vec2 vUv;
${roundBox}
void main() {
  float d = roundBox((vUv - 0.5) * uSize, uBox * 0.5, 0.14);
  float a = (1.0 - smoothstep(-uBlur, uBlur, d)) * uOpacity;
  gl_FragColor = vec4(uColor * a, a * (1.0 - uAdd));
}`;
