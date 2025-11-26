// src/cveScanner.js
import { CVE_DATABASE } from "./cveDatabase.js";

export function scanCves(technology) {
  const findings = [];

  const products = [
    { name: "Apache", value: technology.server },
    { name: "Nginx", value: technology.server },
    { name: "PHP", value: technology.backend },
    { name: "Node", value: technology.backend },
    { name: "WordPress", value: technology.cms }
  ];

  for (const product of products) {
    if (!product.value || product.value === "unknown") continue;

    for (const entry of CVE_DATABASE) {
      if (
        product.value.toLowerCase().includes(entry.product.toLowerCase())
      ) {
        const versionMatch = product.value.match(entry.versionRegex);

        if (versionMatch) {
          entry.cves.forEach((cve) => {
            findings.push({
              product: entry.product,
              detectedVersion: versionMatch[0],
              cve: cve.id,
              severity: cve.severity,
              description: cve.description
            });
          });
        }
      }
    }
  }

  let risk = "low";
  if (findings.some((f) => f.severity === "high")) risk = "high";
  else if (findings.length > 0) risk = "medium";

  return {
    found: findings.length > 0,
    count: findings.length,
    risk,
    findings
  };
}
