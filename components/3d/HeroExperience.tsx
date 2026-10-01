"use client";

import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useState } from "react";
import * as THREE from "three";
import { HeroScene, type SceneQuality } from "./HeroScene";

export type HeroExperienceProps = {
  quality: SceneQuality;
  reducedMotion: boolean;
  active: boolean;
  exploring: boolean;
  pointer: boolean;
  onReady: () => void;
  onFail: () => void;
};

/**
 * The live WebGL hero. Loaded lazily by <HeroStage />, which also owns the
 * static fallback, visibility pausing and device-tier decisions.
 */
export default function HeroExperience({
  quality,
  reducedMotion,
  active,
  exploring,
  pointer,
  onReady,
  onFail,
}: HeroExperienceProps) {
  const maxDpr = quality === "high" ? 1.75 : 1.4;
  const [dpr, setDpr] = useState(maxDpr);

  const handleCreated = useCallback(
    ({ gl }: { gl: THREE.WebGLRenderer }) => {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 0.92;
      gl.domElement.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        onFail();
      });
    },
    [onFail],
  );

  // Reduced motion: render on demand (a still, lit frame). Off-screen or
  // hidden tab: stop rendering entirely.
  const frameloop = !active ? "never" : reducedMotion && !exploring ? "demand" : "always";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={dpr}
      shadows={quality === "high" ? "soft" : false}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 30, near: 0.1, far: 90, position: [-2.3, 2.6, 17] }}
      onCreated={handleCreated}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(maxDpr)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <HeroScene
        quality={quality}
        animate={!reducedMotion}
        pointer={pointer && !exploring && !reducedMotion}
        cameraMode={exploring ? "off" : reducedMotion ? "static" : "animated"}
        onReady={onReady}
      />
      {exploring && (
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.45}
          target={[0, 1.4, 0]}
          minAzimuthAngle={-0.6}
          maxAzimuthAngle={0.6}
          minPolarAngle={1.05}
          maxPolarAngle={1.5}
        />
      )}
    </Canvas>
  );
}
