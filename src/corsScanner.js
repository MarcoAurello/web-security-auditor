// src/corsScanner.js

export function scanCors(headers) {
  const allowOrigin = headers["access-control-allow-origin"];
  const allowCredentials = headers["access-control-allow-credentials"];

  let risk = "low";
  let note = "CORS restritivo.";

  if (allowOrigin === "*") {
    risk = "high";
    note = "CORS totalmente aberto (Access-Control-Allow-Origin: *).";
  }

  if (allowOrigin === "*" && allowCredentials === "true") {
    risk = "high";
    note = "CORS crítico: wildcard com credenciais.";
  }

  return {
    allowOrigin: allowOrigin || "não informado",
    allowCredentials: allowCredentials || "não informado",
    risk,
    note
  };
}
