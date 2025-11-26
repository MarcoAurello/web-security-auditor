// src/headerScanner.js

const SECURITY_HEADERS = [
  "strict-transport-security",
  "content-security-policy",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy"
];

export function analyzeHeaders(headers) {
  const normalizedHeaders = {};
  for (const [key, value] of Object.entries(headers || {})) {
    normalizedHeaders[key.toLowerCase()] = value;
  }

  const results = [];

  for (const header of SECURITY_HEADERS) {
    const present = header in normalizedHeaders;

    results.push({
      header,
      present,
      value: present ? normalizedHeaders[header] : null,
      risk: present ? "low" : "medium"
    });
  }

  // Alguns checks simples de conteúdo
  const csp = normalizedHeaders["content-security-policy"];
  if (!csp) {
    results.push({
      header: "content-security-policy",
      present: false,
      value: null,
      risk: "high",
      note: "Ausência de CSP aumenta risco de XSS."
    });
  }

  const hsts = normalizedHeaders["strict-transport-security"];
  if (!hsts) {
    results.push({
      header: "strict-transport-security",
      present: false,
      value: null,
      risk: "high",
      note: "Sem HSTS, o browser pode aceitar HTTP em vez de HTTPS."
    });
  }

  return results;
}
