// src/riskScorer.js

// Função simples para converter severidade em pontos
function weight(risk) {
  if (risk === "high") return 3;
  if (risk === "medium") return 2;
  if (risk === "low") return 0;
  return 0;
}

// paths que consideramos "bem perigosos" se 200
const CRITICAL_PATHS = [
  "/admin",
  "/login",
  "/dashboard",
  "/control",
  "/actuator/info",
  "/temp",
  "/sistema",
  "/wp-admin",
  "/wp-login.php",
  "/test"
];

export function computeRiskScore(httpInfo, headerResults, tlsResult, pathsResults) {
  let points = 0;
  let maxPoints = 1; // evita divisão por zero

  // 1) Cabeçalhos
  for (const h of headerResults) {
    maxPoints += 3;
    points += weight(h.risk);
  }

  // 2) TLS
  if (tlsResult && tlsResult.ok) {
    maxPoints += 3;
    if (tlsResult.risk === "high") points += 3;
    else if (tlsResult.risk === "medium") points += 1;
  }

  // 3) Caminhos sensíveis
  for (const p of pathsResults) {
    // só consideramos quando retornou algo
    if (p.status === 200) {
      maxPoints += 3;
      const isCritical = CRITICAL_PATHS.includes(p.path);
      points += isCritical ? 3 : 2;
    } else if (p.status === 401 || p.status === 403) {
      maxPoints += 1; // protegido conta a favor, não contra
    }
  }

  // Normaliza para 0–100 (quanto mais pontos, pior)
  const normalized = Math.min(100, Math.round((points / maxPoints) * 100));

  // Define nível
  let level = "low";
  if (normalized >= 70) level = "high";
  else if (normalized >= 40) level = "medium";

  return {
    score: normalized,
    level,
    details: {
      rawPoints: points,
      maxPoints
    }
  };
}
