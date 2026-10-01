"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Distant warm horizon seen through the arch: a single shader plane with a
 * graded sky, a low sun glow and two layered ridge lines. Unaffected by fog.
 */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uGlow;
  uniform vec3 uRidgeNear;
  uniform vec3 uRidgeFar;
  uniform float uHorizon;
  uniform vec2 uSun;

  float ridge(float x, float seed, float amp) {
    return amp * (0.55 * sin(x * 6.0 + seed) + 0.3 * sin(x * 13.0 + seed * 2.1) + 0.15 * sin(x * 29.0 + seed * 3.7));
  }

  void main() {
    vec2 uv = vUv;
    // Sky: espresso overhead easing into warm champagne at the horizon
    float t = smoothstep(uHorizon, 1.0, uv.y);
    vec3 col = mix(uMid, uTop, pow(t, 0.7));

    // Low sun glow, wider horizontally
    vec2 d = (uv - uSun) * vec2(1.0, 2.4);
    float glow = exp(-dot(d, d) * 9.0);
    col += uGlow * glow * 0.85;
    col += uGlow * exp(-abs(uv.y - uHorizon) * 22.0) * 0.25;

    // Far ridge
    float far = uHorizon + 0.035 + ridge(uv.x, 1.3, 0.018);
    col = mix(col, mix(uRidgeFar, col, 0.35), step(uv.y, far));
    // Near ridge
    float near = uHorizon + 0.012 + ridge(uv.x * 0.8, 4.2, 0.024);
    col = mix(col, uRidgeNear, step(uv.y, near));

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function Horizon() {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#15130f") },
      uMid: { value: new THREE.Color("#8a6a42") },
      uGlow: { value: new THREE.Color("#f2cf96") },
      uRidgeNear: { value: new THREE.Color("#1e1b17") },
      uRidgeFar: { value: new THREE.Color("#5b4a37") },
      uHorizon: { value: 0.38 },
      uSun: { value: new THREE.Vector2(0.5, 0.42) },
    }),
    [],
  );
  return (
    <mesh position={[0, 4.2, -22]}>
      <planeGeometry args={[90, 34]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} fog={false} depthWrite={false} />
    </mesh>
  );
}
