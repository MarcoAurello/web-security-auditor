// src/batchScan.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { scanCves } from "./cveScanner.js";


import { httpGet } from "./httpClient.js";
import { analyzeHeaders } from "./headerScanner.js";
import { scanTls } from "./tlsScanner.js";
import { scanSensitivePaths } from "./sensitivePathsScanner.js";
import { computeRiskScore } from "./riskScorer.js";
import { generateHtmlReport } from "./reportGenerator.js";

import { detectTechnology } from "./techFingerprintScanner.js";
import { scanCors } from "./corsScanner.js";
import { hashBody } from "./loginHeuristic.js";
import { scanSessionCookies } from "./sessionCookieScanner.js";
import { scanHttpMethods } from "./httpMethodsScanner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scanOne(target) {
  const fullTarget = target.startsWith("http")
    ? target
    : `https://${target}`;

  console.log(`\n🔎 Iniciando scan em: ${fullTarget}`);

  const urlObj = new URL(fullTarget);

  // 1) HTTP Básico
  const httpInfo = await httpGet(fullTarget);

  // 2) Base HTML
  const baseHtml = httpInfo.body || "";
  const baseHash = hashBody(baseHtml);

  // 3) Tecnologia + CORS
  const technology = detectTechnology(httpInfo.headers, baseHtml);
  const corsResult = scanCors(httpInfo.headers);

  const cveResults = scanCves(technology);


  // 4) Cabeçalhos
  const headerResults = httpInfo.ok
    ? analyzeHeaders(httpInfo.headers)
    : [];

  // 5) TLS
  const tlsResult = await scanTls(fullTarget);

  // 6) Caminhos Sensíveis
  const rawPaths = await scanSensitivePaths(fullTarget);

  const pathsResults = rawPaths.map((p) => {
    if (p.status === 200 && p.body === baseHtml) {
      return {
        ...p,
        risk: "low",
        note: "Roteamento genérico (mesma tela base)."
      };
    }

    return p;
  });

  // 7) Cookies de Sessão
  const sessionCookies = scanSessionCookies(httpInfo.headers);

  // 8) Métodos HTTP
  const httpMethods = await scanHttpMethods(fullTarget);

  // 9) Score
  const riskSummary = computeRiskScore(
    httpInfo,
    headerResults,
    tlsResult,
    pathsResults,
    corsResult,
      cveResults 
  );

  // 10) Resultado Final
  const result = {
    target: fullTarget,
    scannedAt: new Date().toISOString(),
    http: httpInfo,
    tls: tlsResult,
    headers: headerResults,
    paths: pathsResults,
    technology,
    cors: corsResult,
    sessionCookies,
    cves: cveResults,   
    httpMethods,
    risk: riskSummary
  };

  // 11) Arquivo de saída
  const hostname = urlObj.hostname.replace(/[:\\/]/g, "_");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filenameHtml = `scan-${hostname}-${timestamp}.html`;

  const outputDir = path.join(__dirname, "..", "reports");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const htmlPath = path.join(outputDir, filenameHtml);
  generateHtmlReport(result, htmlPath);

  console.log(`✅ Relatório gerado: ./reports/${filenameHtml}`);
  console.log(`📊 Score: ${riskSummary.score}/100 | ${riskSummary.level.toUpperCase()}`);
}

async function main() {
  const urlsFile = path.join(__dirname, "..", "urls.txt");

  const content = fs.readFileSync(urlsFile, "utf-8");

  const urls = content
    .split("\n")
    .map((u) => u.trim())
    .filter((u) => u && !u.startsWith("#"));

  for (const url of urls) {
    try {
      await scanOne(url);
    } catch (err) {
      console.error(`❌ Erro no scan de ${url}:`, err.message);
    }
  }
}

main();
