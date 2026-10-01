"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { getMaterials } from "./materials";

/** Arch outline from the logo: straight jambs with a semicircular head. */
function archShape(outerW: number, innerW: number, springH: number) {
  const ro = outerW / 2;
  const ri = innerW / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-ro, 0);
  shape.lineTo(-ro, springH);
  shape.absarc(0, springH, ro, Math.PI, 0, true);
  shape.lineTo(ro, 0);
  shape.lineTo(-ro, 0);

  const hole = new THREE.Path();
  hole.moveTo(-ri, 0);
  hole.lineTo(ri, 0);
  hole.lineTo(ri, springH);
  hole.absarc(0, springH, ri, 0, Math.PI, false);
  hole.lineTo(-ri, 0);
  shape.holes.push(hole);
  return shape;
}

export function ArchitecturalArch({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  far = false,
}) {
  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(archShape(5.4, 3.7, 3.3), {
      depth: 0.7,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
      curveSegments: 48,
    });
    g.translate(0, 0, -0.35);
    return g;
  }, []);
  const m = getMaterials();

  return (
    <mesh
      geometry={geometry}
      material={far ? m.farStone : m.stone}
      position={position}
      scale={scale}
      castShadow={!far}
      receiveShadow
    />
  );
}
