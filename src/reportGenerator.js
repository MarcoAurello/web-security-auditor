// src/reportGenerator.js
import fs from "fs";

function buildOwaspMap(headers, paths, tls) {
  const map = [];

  if (headers.some(h => h.risk !== "low")) {
    map.push({
      category: "A05 - Security Misconfiguration",
      evidence: "Ausência ou falha em cabeçalhos de segurança."
    });
  }

  if (paths.some(p => p.status === 200 && ["/admin", "/login", "/dashboard", "/control", "/wp-admin"].includes(p.path))) {
    map.push({
      category: "A01 - Broken Access Control",
      evidence: "Endpoints administrativos acessíveis publicamente (HTTP 200)."
    });
  }

  if (paths.some(p => p.path.includes("actuator") && p.status === 200)) {
    map.push({
      category: "A05 - Security Misconfiguration",
      evidence: "Endpoints Spring Boot Actuator expostos."
    });
  }

  if (paths.some(p => p.path.includes("wp-"))) {
    map.push({
      category: "A06 - Vulnerable and Outdated Components",
      evidence: "Indícios de WordPress público."
    });
  }

  if (tls && tls.ok && tls.risk !== "low") {
    map.push({
      category: "A02 - Cryptographic Failures",
      evidence: "Configuração TLS abaixo do recomendado."
    });
  }

  return map;
}

function buildRecommendations(headers, paths, tls) {
  const recs = [];

  if (headers.some(h => h.header === "content-security-policy" && !h.present)) {
    recs.push("Implementar imediatamente o header Content-Security-Policy (CSP).");
  }

  if (headers.some(h => h.header === "strict-transport-security" && !h.present)) {
    recs.push("Ativar o header Strict-Transport-Security (HSTS).");
  }

  paths.forEach(p => {
    if (p.status === 200) {
      recs.push(`Restringir acesso público ao endpoint: ${p.fullUrl}`);
    }
  });

  if (tls && tls.ok && tls.daysToExpire < 45) {
    recs.push("Planejar renovação antecipada do certificado digital.");
  }

  return [...new Set(recs)];
}

function buildConclusion(risk, paths) {
  const exposed = paths.filter(p => p.status === 200).map(p => p.path);

  if (risk.level === "high") {
    return `O sistema apresenta RISCO ALTO, com múltiplos endpoints acessíveis publicamente: ${exposed.join(", ")}. Recomenda-se mitigação imediata.`;
  }

  if (risk.level === "medium") {
    return `O sistema apresenta RISCO MÉDIO, com exposição pontual de endpoints: ${exposed.join(", ")}. Recomenda-se correção priorizada.`;
  }

  return "O sistema apresenta RISCO BAIXO no momento da varredura.";
}

export function generateHtmlReport(result, outputPath) {
  const { target, scannedAt, http, tls, headers, paths, risk } = result;

  const owaspMap = buildOwaspMap(headers, paths, tls);
  const recommendations = buildRecommendations(headers, paths, tls);
  const conclusion = buildConclusion(risk, paths);

  const headerRows = headers.map(h => `
    <tr>
      <td>${h.header}</td>
      <td>${h.present ? "Sim" : "Não"}</td>
      <td class="${h.risk}">${h.risk.toUpperCase()}</td>
      <td>${h.note || ""}</td>
    </tr>
  `).join("");

  const pathRows = paths.map(p => `
    <tr>
      <td>
        ${p.path}<br>
        <a href="${p.fullUrl}" target="_blank">${p.fullUrl}</a>
      </td>
      <td>${p.status ?? "N/A"}</td>
      <td class="${p.risk || "low"}">${(p.risk || "low").toUpperCase()}</td>
      <td>${p.note}</td>
    </tr>
  `).join("");

  const owaspRows = owaspMap.map(o => `
    <tr>
      <td>${o.category}</td>
      <td>${o.evidence}</td>
    </tr>
  `).join("");

  const recRows = recommendations.map(r => `<li>${r}</li>`).join("");

  const html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Relatório de Segurança - ${target}</title>
  <style>
    body { font-family: Arial; background: #f3f4f6; padding: 40px; }
    .container { max-width: 1100px; margin: auto; background: white; padding: 40px; border-radius: 10px; }
    h1, h2 { color: #111827; }
    .box { margin-bottom: 35px; }
    .low { color: green; font-weight: bold; }
    .medium { color: orange; font-weight: bold; }
    .high { color: red; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ccc; padding: 8px; font-size: 14px; }
    th { background: #e5e7eb; }
  </style>
</head>
<body>
<div class="container">

  <h1>Relatório Técnico de Segurança da Informação</h1>
  <p><b>URL:</b> ${target}</p>
  <p><b>Data:</b> ${new Date(scannedAt).toLocaleString()}</p>
  <p><b>Responsável:</b> Marco Aurellio Machado Nunes – Analista de TI – GTIC</p>

  <div class="box">
    <h2>1. Score Geral</h2>
    <p class="${risk.level}"><b>${risk.score}/100 — ${risk.level.toUpperCase()}</b></p>
  </div>

  <div class="box">
    <h2>2. Cabeçalhos de Segurança</h2>
    <table>
      <tr><th>Header</th><th>Presente</th><th>Risco</th><th>Observação</th></tr>
      ${headerRows}
    </table>
  </div>

  <div class="box">
    <h2>3. Caminhos Sensíveis (com URL completa)</h2>
    <table>
      <tr><th>Path</th><th>Status</th><th>Risco</th><th>Observação</th></tr>
      ${pathRows}
    </table>
  </div>

  <div class="box">
    <h2>4. Mapeamento OWASP (Automático)</h2>
    <table>
      <tr><th>Categoria</th><th>Evidência</th></tr>
      ${owaspRows || "<tr><td colspan='2'>Nenhuma categoria crítica mapeada.</td></tr>"}
    </table>
  </div>

  <div class="box">
    <h2>5. Recomendações Técnicas Automáticas</h2>
    <ul>
      ${recRows || "<li>Nenhuma recomendação crítica no momento.</li>"}
    </ul>
  </div>

  <div class="box">
    <h2>6. Conclusão</h2>
    <p>${conclusion}</p>
  </div>

</div>
</body>
</html>
`;

  fs.writeFileSync(outputPath, html, "utf-8");
}
