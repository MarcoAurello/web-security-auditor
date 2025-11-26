// src/cveDatabase.js
export const CVE_DATABASE = [
  {
    product: "Apache",
    versionRegex: /2\.4\.49|2\.4\.50/i,
    cves: [
      {
        id: "CVE-2021-41773",
        severity: "high",
        description: "Path traversal e execução remota de código no Apache 2.4.49/50."
      }
    ]
  },
  {
    product: "OpenSSL",
    versionRegex: /1\.1\.1k/i,
    cves: [
      {
        id: "CVE-2021-3450",
        severity: "medium",
        description: "Forma incorreta de validação de certificados."
      }
    ]
  },
  {
    product: "PHP",
    versionRegex: /7\.2|7\.3/i,
    cves: [
      {
        id: "CVE-2020-7071",
        severity: "high",
        description: "Integer overflow em funções BCMath."
      }
    ]
  },
  {
    product: "WordPress",
    versionRegex: /5\.6|5\.7/i,
    cves: [
      {
        id: "CVE-2021-29447",
        severity: "high",
        description: "XXE vulnerável no WordPress."
      }
    ]
  }
];
