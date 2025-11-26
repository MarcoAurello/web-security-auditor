// src/index.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { httpGet } from "./httpClient.js";
import { analyzeHeaders } from "./headerScanner.js";
import { scanTls } from "./tlsScanner.js";
import { scanSensitivePaths } from "./sensitivePathsScanner.js";
import { printReport } from "./reporter.js";
import { computeRiskScore } from "./riskScorer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const targetArg = process.argv[2];

  if (!targetArg) {
    console.error("Uso: npm run scan -- <URL>");
    console.error("Exemplo: npm run scan -- https://meusistema.com.br");
    process.exit(1);
  }

  const target = targetArg.startsWith("http")
    ? targetArg
    : `https://${targetArg}`;

  console.log(`Iniciando varredura básica em: ${target}`);

  // 1. HTTP
  const httpInfo = await httpGet(target);

  // 2. Cabeçalhos
  const headerResults = httpInfo.ok
    ? analyzeHeaders(httpInfo.headers)
    : [];

  // 3. TLS
  const tlsResult = await scanTls(target);

  // 4. Caminhos sensíveis

const origin = `${urlObj.protocol}//${urlObj.host}`; // ex: https://www6.pe.senac.br

const pathsResults = await scanSensitivePaths(origin);


  // 5. Score de risco
  const riskSummary = computeRiskScore(httpInfo, headerResults, tlsResult, pathsResults);

  // 6. Impressão no terminal
  printReport(target, httpInfo, headerResults, tlsResult, pathsResults, riskSummary);

  // 7. Exporta JSON
  const urlObj = new URL(target);
  const hostname = urlObj.hostname.replace(/[:\\/]/g, "_");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `scan-${hostname}-${timestamp}.json`;

  const outputDir = path.join(__dirname, "..", "reports");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const result = {
    target,
    scannedAt: new Date().toISOString(),
    http: httpInfo,
    tls: tlsResult,
    headers: headerResults,
    paths: pathsResults,
    risk: riskSummary
  };

  fs.writeFileSync(
    path.join(outputDir, filename),
    JSON.stringify(result, null, 2),
    "utf-8"
  );

  console.log(`Relatório JSON salvo em: ./reports/${filename}`);
}

main().catch((err) => {
  console.error("Erro inesperado:", err);
});
