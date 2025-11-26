// src/loginHeuristic.js
import crypto from "crypto";

export function hashBody(body) {
  return crypto.createHash("sha256").update(body).digest("hex");
}

export function detectGenericLogin(baseHash, currentHash) {
  return baseHash === currentHash;
}
