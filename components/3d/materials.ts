import * as THREE from "three";

/** Shared palette for the hero scene — mirrors the CSS design tokens. */
export const sceneColors = {
  espresso: new THREE.Color("#181714"),
  charcoal: new THREE.Color("#252722"),
  ivoryStone: new THREE.Color("#d6ccba"),
  sandstone: new THREE.Color("#d8c7ac"),
  brass: new THREE.Color("#b4935a"),
  champagne: new THREE.Color("#dcc18b"),
  warmLight: new THREE.Color("#f3c98c"),
};

let cache: ReturnType<typeof create> | null = null;

function create() {
  return {
    /** Warm brushed brass — metallic but not mirror-like. */
    brass: new THREE.MeshStandardMaterial({
      color: sceneColors.brass,
      metalness: 1,
      roughness: 0.36,
      envMapIntensity: 0.9,
    }),
    /** Satin ivory stone for the arch. */
    stone: new THREE.MeshStandardMaterial({
      color: sceneColors.ivoryStone,
      roughness: 0.86,
      metalness: 0,
    }),
    /** Darker sandstone for the distant arch. */
    farStone: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#4a443c"),
      roughness: 0.95,
    }),
    /** Polished dark stone plinth. */
    darkStone: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1d1c19"),
      roughness: 0.32,
      metalness: 0.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
    }),
    /** Frosted ivory bead. */
    pearl: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#efe7d8"),
      roughness: 0.4,
      sheen: 0.6,
      sheenColor: new THREE.Color("#dcc18b"),
    }),
  };
}

/** Materials are created once and shared across every mesh that uses them. */
export function getMaterials() {
  if (!cache) cache = create();
  return cache;
}
