import { randomInt } from "node:crypto";

/** Human-friendly booking reference without look-alike characters (0/O, 1/I/L, U). */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

export function makeReference() {
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `PH-${s}`;
}
