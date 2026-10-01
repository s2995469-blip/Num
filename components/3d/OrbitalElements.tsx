"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getMaterials } from "./materials";

type Orbit = {
  radius: number;
  tube: number;
  arc: number;
  tilt: [number, number, number];
  speed: number;
  bead?: { size: number; at: number; kind: "brass" | "pearl" };
};

const ORBITS: Orbit[] = [
  { radius: 1.42, tube: 0.007, arc: Math.PI * 1.55, tilt: [1.32, 0.18, 0.1], speed: 0.05, bead: { size: 0.055, at: 0.4, kind: "brass" } },
  { radius: 1.86, tube: 0.006, arc: Math.PI * 1.2, tilt: [1.05, -0.42, 0.5], speed: -0.035, bead: { size: 0.075, at: 2.6, kind: "pearl" } },
  { radius: 2.35, tube: 0.005, arc: Math.PI * 0.9, tilt: [1.62, 0.32, -0.35], speed: 0.022, bead: { size: 0.045, at: 1.1, kind: "brass" } },
];

/** Thin brushed-brass orbital arcs around the sphere, each carrying one bead. */
export function OrbitalElements({ animate }: { animate: boolean }) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const m = getMaterials();

  const geometries = useMemo(
    () => ORBITS.map((o) => new THREE.TorusGeometry(o.radius, o.tube, 6, 160, o.arc)),
    [],
  );
  const beadGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 24), []);

  useFrame((state, delta) => {
    if (!animate) return;
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    groups.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.z += d * ORBITS[i].speed;
      // Barely-there breathing of the tilt so the arcs feel suspended, not fixed.
      g.rotation.x = ORBITS[i].tilt[0] + Math.sin(t * 0.12 + i * 2) * 0.03;
    });
  });

  return (
    <group position={[0, 1.42, 0]}>
      {ORBITS.map((o, i) => (
        <group key={i} rotation={o.tilt}>
          <group ref={(el) => void (groups.current[i] = el)}>
            <mesh geometry={geometries[i]} material={m.brass} castShadow />
            {o.bead && (
              <mesh
                geometry={beadGeometry}
                material={o.bead.kind === "brass" ? m.brass : m.pearl}
                position={[Math.cos(o.bead.at) * o.radius, Math.sin(o.bead.at) * o.radius, 0]}
                scale={o.bead.size}
                castShadow
              />
            )}
          </group>
        </group>
      ))}
    </group>
  );
}
