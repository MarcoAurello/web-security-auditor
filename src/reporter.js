// src/reporter.js
import chalk from "chalk";

export function printReport(target, httpInfo, headerResults, tlsResult, pathsResults, riskSummary) {
  console.log(chalk.bold(`\n=== Relatório de Segurança para: ${target} ===\n`));

  // Score geral
  if (riskSummary) {
    const { score, level } = riskSummary;
    const color =
      level === "high" ? chalk.red :
      level === "medium" ? chalk.yellow :
      chalk.green;

    console.log(chalk.bold("0. Score Geral de Risco"));
    console.log(`  ▶ Score: ${color(`${score}/100`)} (nível: ${level.toUpperCase()})\n`);
  }

  // 1. HTTP
  console.log(chalk.bold("1. HTTP Básico"));
  if (!httpInfo.ok) {
    console.log(`  ❌ Erro ao acessar: ${httpInfo.error}`);
  } else {
    console.log(`  ✅ Status: ${httpInfo.status} (em ${httpInfo.timeMs} ms)`);
  }

  // 2. TLS
  console.log(chalk.bold("\n2. HTTPS / TLS"));
  if (!tlsResult.ok) {
    console.log(`  ❌ Erro TLS: ${tlsResult.error}`);
  } else {
    console.log(`  ✅ Certificado emitido para: ${JSON.stringify(tlsResult.subject)}`);
    console.log(`  ▶ Emissor: ${JSON.stringify(tlsResult.issuer)}`);
    console.log(`  ▶ Válido até: ${tlsResult.validTo.toISOString()} (${tlsResult.daysToExpire} dias)`);
    console.log(`  ▶ Risco relativo ao certificado: ${tlsResult.risk}`);
  }

  // 3. Cabeçalhos
  console.log(chalk.bold("\n3. Cabeçalhos de Segurança"));
  if (!headerResults || headerResults.length === 0) {
    console.log("  ℹ️ Não foi possível analisar cabeçalhos.");
  } else {
    for (const h of headerResults) {
      const icon = h.present ? "✅" : "⚠️";
      const riskColor =
        h.risk === "high" ? chalk.red :
        h.risk === "medium" ? chalk.yellow :
        chalk.green;

      console.log(
        `  ${icon} ${h.header} -> ${riskColor(h.risk)} ` +
        (h.note ? `- ${h.note}` : "") +
        (h.value ? ` (valor: ${String(h.value).slice(0, 80)}...)` : "")
      );
    }
  }

  // 4. Caminhos sensíveis
  console.log(chalk.bold("\n4. Caminhos Sensíveis"));
  if (!pathsResults || pathsResults.length === 0) {
    console.log("  ℹ️ Nenhum caminho testado.");
  } else {
    for (const p of pathsResults) {
      const icon =
        p.status === 200 ? "⚠️" :
        p.status === 401 || p.status === 403 ? "✅" :
        "ℹ️";

      console.log(
        `  ${icon} ${p.path} [${p.status ?? "N/A"}] - ${p.note}`
      );
    }
  }

  console.log(chalk.bold("\n=== Fim do relatório ===\n"));
}
