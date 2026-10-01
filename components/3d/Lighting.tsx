"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Warm source inside the arch, soft key from the front-left, rim behind the
 * sphere. Reflections come from a tiny procedural environment (no HDR fetch).
 */
export function Lighting({ shadows }: { shadows: boolean }) {
  return (
    <>
      <ambientLight intensity={0.06} color="#f0e2cc" />
      <hemisphereLight args={["#f3dcb4", "#120f0c", 0.12]} />

      {/* Key light */}
      <directionalLight
        position={[-6, 5, 3]}
        intensity={0.75}
        color="#fff1dc"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />

      {/* Warm glow from within the arch, rimming the sphere */}
      <pointLight position={[0, 2.6, -3.6]} intensity={26} distance={12} decay={2} color="#f3c98c" />
      <spotLight
        position={[1.6, 4.2, -2.6]}
        angle={0.5}
        penumbra={1}
        intensity={22}
        distance={10}
        color="#ffd9a1"
        target-position={[0, 1.4, 0]}
      />

      <Environment resolution={64} frames={1} environmentIntensity={0.45}>
        <Lightformer form="rect" intensity={2.2} color="#f3c98c" position={[0, 2, -6]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#fff4e3" position={[-5, 5, 4]} scale={[4, 4, 1]} />
        <Lightformer form="ring" intensity={0.6} color="#dcc18b" position={[5, 2, 2]} scale={2} />
      </Environment>
    </>
  );
}
