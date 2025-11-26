// src/sensitivePathsScanner.js
import { httpGet } from "./httpClient.js";

const COMMON_PATHS = [
  // Administrativos básicos
  "/admin",
  "/administrator",
  "/login",
  "/logout",
  "/panel",
  "/dashboard",
  "/manage",
  "/management",
  "/control",
  "/cpanel",

  // Documentações e APIs
  "/swagger",
  "/swagger-ui",
  "/swagger-ui.html",
  "/v2/api-docs",
  "/v3/api-docs",
  "/api-docs",
  "/openapi",
  "/openapi.json",
  "/redoc",

  // Spring Boot / Java
  "/actuator",
  "/actuator/health",
  "/actuator/info",
  "/actuator/env",
  "/actuator/metrics",
  "/actuator/configprops",
  "/actuator/mappings",

  // Node / Configurações
  "/config",
  "/configs",
  "/config.json",
  "/settings",
  "/settings.json",

  // Variáveis de ambiente / arquivos sensíveis
  "/.env",
  "/.env.local",
  "/.env.dev",
  "/.env.prod",
  "/.git",
  "/.git/HEAD",
  "/.git/config",
  "/.gitignore",
  "/.svn",
  "/.hg",

  // Backups e arquivos esquecidos
  "/backup",
  "/backup.zip",
  "/backup.tar",
  "/backup.sql",
  "/db.sql",
  "/dump.sql",
  "/database.sql",
  "/site.bak",
  "/www.zip",

  // PHP / Servidor
  "/phpinfo.php",
  "/info.php",
  "/server-status",
  "/server-info",
  "/test.php",

  // Logs
  "/log",
  "/logs",
  "/app.log",
  "/error.log",
  "/access.log",
  "/debug.log",

  // Uploads desprotegidos
  "/upload",
  "/uploads",
  "/files",
  "/tmp",
  "/temp",

  // Autenticação alternativa
  "/auth",
  "/auth/login",
  "/auth/admin",
  "/oauth",
  "/oauth/token",

  // Sistemas corporativos comuns
  "/sisadmin",
  "/sistema",
  "/sistema/admin",
  "/interno",
  "/privado",

  // Containers / DevOps
  "/docker",
  "/docker-compose.yml",
  "/.docker",
  "/kube",
  "/kubernetes",
  "/helm",

  // Ferramentas de monitoramento
  "/metrics",
  "/monitor",
  "/status",
  "/health",
  "/ping",

  // Frameworks variados
  "/laravel.log",
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",

  // Testes
  "/test",
  "/tests",
  "/qa",
  "/homolog",
  "/homologacao"
];


export async function scanSensitivePaths(baseUrl) {
  const results = [];

  for (const path of COMMON_PATHS) {
    const target = new URL(path, baseUrl).toString();

    const res = await httpGet(target);

    if (!res.ok) {
      results.push({
        path,
        url: target,
        reachable: false,
        status: null,
        risk: "low",
        note: `Erro ao acessar: ${res.error}`
      });
      continue;
    }

    // Status 200 ou 401/403 podem ser interessantes
    let risk = "low";
    let note = "";

    if (res.status === 200) {
      risk = "medium";
      note = "Endpoint sensível acessível (200). Verificar necessidade de restrição.";
    } else if (res.status === 401 || res.status === 403) {
      risk = "low";
      note = "Protegido por autenticação/autorização (401/403).";
    } else if (res.status === 404) {
      risk = "low";
      note = "Não encontrado (404). Provavelmente ok.";
    }

    results.push({
      path,
      url: target,
      reachable: true,
      status: res.status,
      risk,
      note
    });
  }

  return results;
}
