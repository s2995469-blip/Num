"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createSphereTextures } from "./textures";
import { getMaterials } from "./materials";

/**
 * Carved ivory sphere resting on a polished stone plinth. The 7 is a quiet
 * visual motif, nothing more.
 */
export function NumerologySphere({ animate, quality }: { animate: boolean; quality: "high" | "lite" }) {
  const sphere = useRef<THREE.Mesh>(null);

  const { material, textures } = useMemo(() => {
    const textures = createSphereTextures(quality === "high" ? 2048 : 1024);
    const material = new THREE.MeshPhysicalMaterial({
      map: textures.map,
      bumpMap: textures.bumpMap,
      bumpScale: 1.6,
      roughness: 0.58,
      sheen: 0.35,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color("#f3dcb4"),
      clearcoat: 0.12,
      clearcoatRoughness: 0.5,
    });
    return { material, textures };
  }, [quality]);

  useEffect(
    () => () => {
      material.dispose();
      textures.map.dispose();
      textures.bumpMap.dispose();
    },
    [material, textures],
  );

  // Very slow rotation; the 7 drifts out of view and back over ~70s.
  useFrame((_, delta) => {
    if (!animate || !sphere.current) return;
    sphere.current.rotation.y += Math.min(delta, 0.05) * 0.09;
  });

  const m = getMaterials();
  const segments = quality === "high" ? [128, 96] : [72, 48];

  return (
    <group>
      <mesh ref={sphere} material={material} position={[0, 1.42, 0]} rotation={[0.08, -0.35, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1, segments[0], segments[1]]} />
      </mesh>
      {/* Plinth: two stacked discs of dark polished stone */}
      <mesh material={m.darkStone} position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.4, 64]} />
      </mesh>
      <mesh material={m.darkStone} position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[1.45, 1.5, 0.06, 64]} />
      </mesh>
      {/* Brass seat ring where the sphere meets the plinth */}
      <mesh material={m.brass} position={[0, 0.41, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.012, 8, 96]} />
      </mesh>
    </group>
  );
}
