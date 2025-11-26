// src/tlsScanner.js
import tls from "tls";

export function scanTls(urlString) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlString);
      const host = url.hostname;
      const port = url.port || 443;

      const options = {
        host,
        port,
        servername: host,
        rejectUnauthorized: false // não vamos falhar em self-signed
      };

      const socket = tls.connect(options, () => {
        const cert = socket.getPeerCertificate();
        if (!cert || Object.keys(cert).length === 0) {
          socket.end();
          return resolve({
            ok: false,
            error: "Nenhum certificado retornado.",
          });
        }

        const now = new Date();
        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);

        const daysToExpire = Math.round(
          (validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        let risk = "low";
        if (daysToExpire < 0) {
          risk = "high";
        } else if (daysToExpire < 30) {
          risk = "medium";
        }

        socket.end();

        resolve({
          ok: true,
          subject: cert.subject,
          issuer: cert.issuer,
          validFrom,
          validTo,
          daysToExpire,
          risk
        });
      });

      socket.on("error", (err) => {
        resolve({
          ok: false,
          error: err.message
        });
      });
    } catch (err) {
      resolve({
        ok: false,
        error: err.message
      });
    }
  });
}
