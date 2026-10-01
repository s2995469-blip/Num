"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Composition per viewport shape. On wide screens the camera pans left so the
 * arch sits to the right of the headline; on portrait screens it pulls back
 * and lifts the sculpture into the upper half, above the copy.
 */
export function framing(aspect: number) {
  if (aspect >= 1.2) {
    return { fov: 30, panX: -Math.min(3, aspect * 1.45), distance: 15, camY: 2.3, targetY: 2.5 };
  }
  if (aspect >= 0.85) return { fov: 40, panX: 0, distance: 15, camY: 2.1, targetY: 1.4 };
  return { fov: 50, panX: 0, distance: 18.5, camY: 2.4, targetY: -1.6 };
}

/**
 * Slow settle-in on load, then a restrained response to the pointer
 * (desktop only). The page never scroll-jacks the camera.
 */
export function CameraRig({
  pointer,
  mode,
}: {
  pointer: boolean;
  /** animated: intro + drift + pointer; static: fixed framing (reduced motion); off: user controls. */
  mode: "animated" | "static" | "off";
}) {
  const target = useRef(new THREE.Vector3(0, 1.55, 0));
  const mouse = useRef({ x: 0, y: 0 });
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (!pointer) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer]);

  useFrame((state, delta) => {
    if (mode === "off") return;
    const { camera, size } = state;
    const f = framing(size.width / size.height);
    const cam = camera as THREE.PerspectiveCamera;
    if (cam.fov !== f.fov) {
      cam.fov = f.fov;
      cam.updateProjectionMatrix();
    }
    if (mode === "static") {
      camera.position.set(f.panX, f.camY, f.distance);
      target.current.set(f.panX, f.targetY, 0);
      camera.lookAt(target.current);
      return;
    }
    if (start.current === null) start.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - start.current;
    const settle = 1 - Math.pow(1 - Math.min(elapsed / 4, 1), 3);

    const baseZ = f.distance + (1 - settle) * 2.2;
    const baseY = f.camY + (1 - settle) * 0.5;
    const px = pointer ? mouse.current.x * 0.45 : 0;
    const py = pointer ? -mouse.current.y * 0.18 : 0;
    // Slow ambient drift so the scene never feels frozen.
    const drift = Math.sin(state.clock.elapsedTime * 0.07) * 0.12;

    const k = 1 - Math.exp(-Math.min(delta, 0.05) * 1.6);
    camera.position.x += (f.panX + px + drift - camera.position.x) * k;
    camera.position.y += (baseY + py - camera.position.y) * k;
    camera.position.z += (baseZ - camera.position.z) * k;
    target.current.set(f.panX, f.targetY, 0);
    camera.lookAt(target.current);
  });

  return null;
}
