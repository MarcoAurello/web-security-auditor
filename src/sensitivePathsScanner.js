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
  "/v2/api-docs",
  "/v3/api-docs",
  "/api-docs",
  "/openapi",
  "/redoc",
  "/actuator",
  "/actuator/health",
  "/actuator/info",
  "/config",
  "/settings",
  "/.env",
  "/.git",
  "/backup",
  "/db.sql",
  "/server-status",
  "/upload",
  "/tmp",
  "/auth",
  "/oauth",
  "/sistema",
  "/interno",
  "/privado",
  "/docker",
  "/kubernetes",
  "/metrics",
  "/status",
  "/health",
  "/ping",
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",
  "/test",
  "/homolog",
  "/homologacao"
];

function extractTitle(html = "") {
  const match = html.match(/<title>(.*?)<\/title>/i);
  return match ? match[1].trim() : "sem título";
}

export async function scanSensitivePaths(baseUrl) {
  const results = [];

  const cleanBase = baseUrl.replace(/\/$/, "");

  for (const path of COMMON_PATHS) {
    const fullUrl = `${cleanBase}${path}`;

    try {
      const res = await httpGet(fullUrl);

      const body = res.body || "";
      const title = extractTitle(body);
      const size = body.length;

      let risk = "low";
      let note = "Não encontrado ou protegido.";

      if (res.status === 200) {
        risk = "high"; // será corrigido depois pela heurística
        note = "Resposta HTTP 200 detectada.";
      } else if (res.status === 401 || res.status === 403) {
        risk = "low";
        note = "Protegido por autenticação/autorização.";
      } else if (res.status === 405) {
        risk = "medium";
        note = "Método não permitido (405).";
      } else if ([301, 302].includes(res.status)) {
        risk = "medium";
        note = "Redirecionamento detectado.";
      }

      results.push({
        path,
        fullUrl,
        status: res.status,
        risk,
        note,
        body,
        title,
        size
      });

    } catch (err) {
      results.push({
        path,
        fullUrl,
        status: null,
        risk: "low",
        note: "Erro ao acessar o endpoint.",
        body: "",
        title: "sem título",
        size: 0
      });
    }
  }

  return results;
}
