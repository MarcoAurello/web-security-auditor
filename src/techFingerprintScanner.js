// src/techFingerprintScanner.js

export function detectTechnology(headers, html = "") {
  const tech = {
    server: "unknown",
    backend: "unknown",
    frontend: "unknown",
    cms: "unknown"
  };

  const serverHeader = headers["server"];
  if (serverHeader) {
    if (serverHeader.includes("nginx")) tech.server = "Nginx";
    else if (serverHeader.includes("apache")) tech.server = "Apache";
    else if (serverHeader.includes("iis")) tech.server = "Microsoft IIS";
    else tech.server = serverHeader;
  }

  const powered = headers["x-powered-by"];
  if (powered) {
    if (powered.includes("PHP")) tech.backend = "PHP";
    else if (powered.includes("Express")) tech.backend = "Node.js (Express)";
    else if (powered.includes("ASP.NET")) tech.backend = "ASP.NET";
    else tech.backend = powered;
  }

  if (html.includes("wp-content")) tech.cms = "WordPress";
  if (html.includes("Drupal")) tech.cms = "Drupal";
  if (html.includes("Magento")) tech.cms = "Magento";

  if (html.includes("react")) tech.frontend = "React";
  if (html.includes("angular")) tech.frontend = "Angular";
  if (html.includes("vue")) tech.frontend = "Vue";

  return tech;
}
