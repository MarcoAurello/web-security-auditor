// src/batchScan.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { httpGet } from "./httpClient.js";
import { analyzeHeaders } from "./headerScanner.js";
import { scanTls } from "./tlsScanner.js";
import { scanSensitivePaths } from "./sensitivePathsScanner.js";
import { computeRiskScore } from "./riskScorer.js";
import { generateHtmlReport } from "./reportGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Escaneia UMA URL
async function scanOne(target) {
  const url = target.startsWith("http") ? target : `https://${target}`;

  console.log(`\n🔎 Escaneando: ${url}`);

  // 1. HTTP
  const httpInfo = await httpGet(url);

  // 2. Headers
  const headerResults = httpInfo.ok
    ? analyzeHeaders(httpInfo.headers)
    : [];

  // 3. TLS
  const tlsResult = await scanTls(url);

  // 4. Caminhos sensíveis
  const pathsResults = await scanSensitivePaths(url);

  // 5. Score de risco
  const riskSummary = computeRiskScore(
    httpInfo,
    headerResults,
    tlsResult,
    pathsResults
  );

  // 6. Resultado final
  const result = {
    target: url,
    scannedAt: new Date().toISOString(),
    http: httpInfo,
    tls: tlsResult,
    headers: headerResults,
    paths: pathsResults,
    risk: riskSummary
  };

  // 7. Nome do arquivo
  const hostname = new URL(url).hostname.replace(/[:\\/]/g, "_");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filenameHtml = `scan-${hostname}-${timestamp}.html`;

  // 8. Cria pasta /reports se não existir
  const outputDir = path.join(__dirname, "..", "reports");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // 9. Gera o HTML
  const htmlPath = path.join(outputDir, filenameHtml);
  generateHtmlReport(result, htmlPath);

  console.log(`✅ Relatório HTML salvo: ./reports/${filenameHtml}`);
}

// Execução em lote
async function main() {
  const urlsFile = path.join(__dirname, "..", "urls.txt");

  if (!fs.existsSync(urlsFile)) {
    console.error("❌ Arquivo urls.txt não encontrado na raiz do projeto.");
    process.exit(1);
  }

  const content = fs.readFileSync(urlsFile, "utf-8");

  const urls = content
    .split("\n")
    .map((u) => u.trim())
    .filter((u) => u.length > 0 && !u.startsWith("#"));

  if (urls.length === 0) {
    console.error("❌ Nenhuma URL encontrada no arquivo urls.txt.");
    process.exit(1);
  }

  console.log(`🚀 Iniciando varredura em ${urls.length} URL(s)...`);

  for (const url of urls) {
    try {
      await scanOne(url);
    } catch (err) {
      console.error(`❌ Erro ao escanear ${url}:`, err.message);
    }
  }

  console.log("\n🎉 Varredura em lote finalizada com sucesso!");
}

main();
