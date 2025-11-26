// src/reportGenerator.js
import fs from "fs";

// -------------------------------
// Classificação Institucional
// -------------------------------
function getInstitutionalClassification(score) {
  if (score >= 85) return "CRÍTICO";
  if (score >= 60) return "ALTO";
  if (score >= 30) return "MÉDIO";
  return "BAIXO";
}

// -------------------------------
// Construção do HTML
// -------------------------------
export function generateHtmlReport(result, outputPath) {
  const {
    target,
    scannedAt,
    http,
    tls,
    headers,
    paths,
    technology,
    cors,
    sessionCookies,
    httpMethods,
    cves,
    risk
  } = result;

  const institutionalClass = getInstitutionalClassification(risk.score);

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
        <small><a href="${p.fullUrl}" target="_blank">${p.fullUrl}</a></small>
      </td>
      <td>${p.status ?? "N/A"}</td>
      <td class="${p.risk}">${p.risk.toUpperCase()}</td>
      <td>${p.note}</td>
    </tr>
  `).join("");

  const httpMethodRows = httpMethods.map(m => `
    <tr>
      <td>${m.method}</td>
      <td>${m.status ?? "N/A"}</td>
      <td class="${m.risk}">${m.risk.toUpperCase()}</td>
      <td>${m.note}</td>
    </tr>
  `).join("");

  const cookieRows = sessionCookies.cookies.map(c => `
    <tr>
      <td>${c.raw}</td>
      <td>${c.httpOnly ? "Sim" : "Não"}</td>
      <td>${c.secure ? "Sim" : "Não"}</td>
      <td>${c.sameSite}</td>
    </tr>
  `).join("");

  const cveRows = cves.findings.length > 0
    ? cves.findings.map(v => `
      <tr>
        <td>${v.product}</td>
        <td>${v.detectedVersion}</td>
        <td>${v.cve}</td>
        <td class="${v.severity}">${v.severity.toUpperCase()}</td>
        <td>${v.description}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="5">Nenhuma CVE conhecida detectada.</td></tr>`;

  const html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Relatório de Segurança - ${target}</title>
  <style>
    body { font-family: Arial; background: #f3f4f6; padding: 40px; }
    .container { max-width: 1200px; margin: auto; background: white; padding: 40px; border-radius: 10px; }
    h1, h2 { color: #111827; }
    .box { margin-bottom: 40px; }

    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ccc; padding: 8px; font-size: 14px; }
    th { background: #e5e7eb; }

    .low { color: green; font-weight: bold; }
    .medium { color: orange; font-weight: bold; }
    .high { color: red; font-weight: bold; }

    .CRÍTICO { color: darkred; font-weight: bold; }
    .ALTO { color: red; font-weight: bold; }
    .MÉDIO { color: orange; font-weight: bold; }
    .BAIXO { color: green; font-weight: bold; }

    .severity-high { background: #fecaca; }
    .severity-medium { background: #fde68a; }
    .severity-low { background: #bbf7d0; }
  </style>
</head>

<body>
<div class="container">

  <h1>Relatório Técnico de Segurança da Informação</h1>

  <p><b>URL Avaliada:</b> ${target}</p>
  <p><b>Data da Varredura:</b> ${new Date(scannedAt).toLocaleString()}</p>
  <p><b>Classificação Institucional:</b> <span class="${institutionalClass}">${institutionalClass}</span></p>

  <div class="box">
    <h2>1. Score Geral</h2>
    <p><b>${risk.score}/100</b> — Nível Técnico: <span class="${risk.level}">${risk.level.toUpperCase()}</span></p>

    <ul>
      <li>Headers: ${risk.breakdown.headers}</li>
      <li>TLS: ${risk.breakdown.tls}</li>
      <li>Paths: ${risk.breakdown.paths}</li>
      <li>CORS: ${risk.breakdown.cors}</li>
      <li>CVEs: ${risk.breakdown.cves}</li>
    </ul>
  </div>

  <div class="box">
    <h2>2. Tecnologia Detectada</h2>
    <ul>
      <li>Servidor: ${technology.server}</li>
      <li>Backend: ${technology.backend}</li>
      <li>Frontend: ${technology.frontend}</li>
      <li>CMS: ${technology.cms}</li>
    </ul>
  </div>

  <div class="box">
    <h2>3. Cabeçalhos de Segurança</h2>
    <table>
      <tr><th>Header</th><th>Presente</th><th>Risco</th><th>Observação</th></tr>
      ${headerRows}
    </table>
  </div>

  <div class="box">
    <h2>4. Caminhos Sensíveis</h2>
    <table>
      <tr><th>Path</th><th>Status</th><th>Risco</th><th>Observação</th></tr>
      ${pathRows}
    </table>
  </div>

  <div class="box">
    <h2>5. Segurança de Sessão (Cookies)</h2>
    <p><b>Risco:</b> ${sessionCookies.risk.toUpperCase()}</p>
    <p>${sessionCookies.note}</p>

    <table>
      <tr><th>Cookie</th><th>HttpOnly</th><th>Secure</th><th>SameSite</th></tr>
      ${cookieRows || "<tr><td colspan='4'>Nenhum cookie analisado.</td></tr>"}
    </table>
  </div>

  <div class="box">
    <h2>6. Métodos HTTP Perigosos</h2>
    <table>
      <tr><th>Método</th><th>Status</th><th>Risco</th><th>Observação</th></tr>
      ${httpMethodRows}
    </table>
  </div>

  <div class="box">
    <h2>7. Vulnerabilidades Conhecidas (CVE)</h2>
    <p><b>Risco por CVE:</b> <span class="${cves.risk}">${cves.risk.toUpperCase()}</span></p>
    <p><b>Total de CVEs Detectadas:</b> ${cves.count}</p>

    <table>
      <tr>
        <th>Produto</th>
        <th>Versão</th>
        <th>CVE</th>
        <th>Severidade</th>
        <th>Descrição</th>
      </tr>
      ${cveRows}
    </table>
  </div>

  <div class="box">
    <h2>8. Conclusão Executiva</h2>
    <p>
      Com base nos testes realizados de forma não intrusiva, o sistema avaliado
      foi classificado institucionalmente como
      <b class="${institutionalClass}">${institutionalClass}</b>.
      Recomenda-se priorização das correções conforme o nível de criticidade apresentado,
      com atenção especial às vulnerabilidades de maior impacto operacional e de segurança.
    </p>
  </div>

  <hr>
  <p><b>Responsável Técnico:</b> Marco Aurellio Machado Nunes – Analista de Tecnologia da Informação – GTIC</p>

</div>
</body>
</html>
`;

  fs.writeFileSync(outputPath, html, "utf-8");
}
