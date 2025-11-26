// src/sensitivePathsScanner.js
import { httpGet } from "./httpClient.js";

const COMMON_PATHS = [
  "/admin",
  "/administrator",
  "/login",
  "/logout",
  "/dashboard",
  "/control",
  "/swagger",
  "/swagger-ui",
  "/swagger-ui.html",
  "/v2/api-docs",
  "/v3/api-docs",
  "/api-docs",
  "/openapi",
  "/openapi.json",
  "/redoc",
  "/actuator",
  "/actuator/health",
  "/actuator/info",
  "/actuator/env",
  "/config",
  "/configs",
  "/config.json",
  "/settings",
  "/settings.json",
  "/.env",
  "/.git",
  "/backup",
  "/backup.zip",
  "/backup.tar",
  "/backup.sql",
  "/db.sql",
  "/dump.sql",
  "/database.sql",
  "/phpinfo.php",
  "/server-status",
  "/upload",
  "/uploads",
  "/files",
  "/tmp",
  "/temp",
  "/auth",
  "/oauth",
  "/sisadmin",
  "/sistema",
  "/interno",
  "/privado",
  "/docker",
  "/kubernetes",
  "/metrics",
  "/monitor",
  "/status",
  "/health",
  "/ping",
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",
  "/test",
  "/tests",
  "/qa",
  "/homolog",
  "/homologacao"
];

export async function scanSensitivePaths(baseUrl) {
  const results = [];

  for (const path of COMMON_PATHS) {
    const fullUrl = `${baseUrl.replace(/\/$/, "")}${path}`;

    try {
      const res = await httpGet(fullUrl);

      let risk = "low";
      let note = "Não encontrado ou protegido.";

      if (res.ok && res.status === 200) {
        risk = "high";
        note = "Endpoint sensível acessível (200). Verificar restrição.";
      } else if (res.status === 401 || res.status === 403) {
        risk = "low";
        note = "Protegido por autenticação/autorização.";
      } else if (res.status === 405) {
        risk = "medium";
        note = "Endpoint existe, mas método não permitido (405).";
      } else if (res.status === 301 || res.status === 302) {
        risk = "medium";
        note = "Endpoint redireciona. Avaliar destino.";
      }

      results.push({
        path,
        fullUrl,              // ✅ URL completa capturada
        status: res.status,
        risk,
        note
      });

    } catch (err) {
      results.push({
        path,
        fullUrl,              // ✅ URL completa capturada mesmo com erro
        status: null,
        risk: "low",
        note: "Erro ao acessar o endpoint."
      });
    }
  }

  return results;
}
