// src/httpMethodsScanner.js
import { httpGet } from "./httpClient.js";

const DANGEROUS_METHODS = ["OPTIONS", "PUT", "DELETE", "TRACE"];

export async function scanHttpMethods(baseUrl) {
  const results = [];

  for (const method of DANGEROUS_METHODS) {
    try {
      const res = await httpGet(baseUrl, { method });

      let risk = "low";
      let note = "Método não permitido.";

      if (res.status === 200 || res.status === 204) {
        risk = "high";
        note = `Método HTTP ${method} aceito pelo servidor.`;
      } else if (res.status === 401 || res.status === 403) {
        risk = "low";
        note = "Protegido por autenticação/autorização.";
      }

      results.push({
        method,
        status: res.status,
        risk,
        note
      });
    } catch (err) {
      results.push({
        method,
        status: null,
        risk: "low",
        note: "Erro ao testar método."
      });
    }
  }

  return results;
}
