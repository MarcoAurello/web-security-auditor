// src/riskScorer.js

function weight(risk) {
  if (risk === "high") return 8;
  if (risk === "medium") return 4;
  return 0;
}

export function computeRiskScore(httpInfo, headers, tls, paths, cors, cves) {
  // ===============================
  // 1) Cabeçalhos (até 40)
  // ===============================
  const headersScore = Math.min(
    40,
    headers.reduce((acc, h) => acc + weight(h.risk), 0)
  );

  // ===============================
  // 2) Caminhos Sensíveis (até 40)
  // ===============================
  const pathsScore = Math.min(
    40,
    paths.reduce((acc, p) => acc + weight(p.risk), 0)
  );

  // ===============================
  // 3) TLS (até 20)
  // ===============================
  let tlsScore = 0;
  if (tls && tls.risk === "high") tlsScore = 20;
  else if (tls && tls.risk === "medium") tlsScore = 10;

  // ===============================
  // 4) CORS (até 10)
  // ===============================
  let corsScore = 0;
  if (cors && cors.risk === "high") corsScore = 10;

  // ===============================
  // 5) CVEs (até 20)
  // ===============================
  let cveScore = 0;
  if (cves && cves.risk === "high") cveScore = 20;
  else if (cves && cves.risk === "medium") cveScore = 10;

  // ===============================
  // SCORE FINAL
  // ===============================
  let score = headersScore + pathsScore + tlsScore + corsScore + cveScore;
  score = Math.min(score, 100);

  // ===============================
  // NÍVEL
  // ===============================
  let level = "low";
  if (score >= 60) level = "high";
  else if (score >= 30) level = "medium";

  return {
    score,
    level,
    breakdown: {
      headers: headersScore,
      paths: pathsScore,
      tls: tlsScore,
      cors: corsScore,
      cves: cveScore
    }
  };
}
