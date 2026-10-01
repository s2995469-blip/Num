"use client";

import { MeshReflectorMaterial, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { ArchitecturalArch } from "./ArchitecturalArch";
import { CameraRig } from "./CameraRig";
import { Horizon } from "./Horizon";
import { Lighting } from "./Lighting";
import { getMaterials } from "./materials";
import { NumerologySphere } from "./NumerologySphere";
import { OrbitalElements } from "./OrbitalElements";

export type SceneQuality = "high" | "lite";

/** Calls onReady once the first couple of frames have actually rendered. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    if (++frames.current >= 2) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

function Water({ quality }: { quality: SceneQuality }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
      <planeGeometry args={[90, 40]} />
      {quality === "high" ? (
        <MeshReflectorMaterial
          resolution={512}
          blur={[420, 120]}
          mixBlur={1}
          mixStrength={3.2}
          mixContrast={1}
          depthScale={1.1}
          minDepthThreshold={0.35}
          maxDepthThreshold={1.3}
          roughness={0.92}
          metalness={0.55}
          mirror={0.6}
          color="#14130f"
        />
      ) : (
        <meshStandardMaterial color="#141310" roughness={0.3} metalness={0.7} />
      )}
    </mesh>
  );
}

export function HeroScene({
  quality,
  animate,
  pointer,
  cameraMode,
  onReady,
}: {
  quality: SceneQuality;
  animate: boolean;
  pointer: boolean;
  cameraMode: "animated" | "static" | "off";
  onReady: () => void;
}) {
  const m = getMaterials();
  return (
    <>
      <color attach="background" args={["#181714"]} />
      <fog attach="fog" args={["#4a3a29", 18, 46]} />

      <Lighting shadows={quality === "high"} />
      <Horizon />

      {/* Background: a second, larger arch further back for layered depth */}
      <ArchitecturalArch position={[7.5, 0, -15]} scale={1.7} far />

      {/* Middle ground: the main arch, framing the warm horizon */}
      <ArchitecturalArch position={[0, 0, -3.4]} scale={1.08} />

      {/* Centre: carved sphere and brass orbits */}
      <NumerologySphere animate={animate} quality={quality} />
      <OrbitalElements animate={animate} />

      {/* Foreground: a low stone slab breaking the water line */}
      <mesh material={m.darkStone} position={[3.4, 0.06, 2.6]} rotation={[0, -0.35, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.6, 0.14, 0.9]} />
      </mesh>

      <Water quality={quality} />

      <Sparkles
        count={quality === "high" ? 36 : 18}
        scale={[9, 4, 6]}
        position={[0, 2.2, -1]}
        size={1.6}
        speed={animate ? 0.12 : 0}
        opacity={0.45}
        color="#dcc18b"
        noise={0.4}
      />

      <CameraRig pointer={pointer} mode={cameraMode} />
      <ReadySignal onReady={onReady} />
    </>
  );
}
