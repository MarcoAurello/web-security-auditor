// src/sessionCookieScanner.js

export function scanSessionCookies(headers) {
  const setCookie = headers["set-cookie"];

  if (!setCookie) {
    return {
      found: false,
      cookies: [],
      risk: "low",
      note: "Nenhum cookie de sessão detectado."
    };
  }

  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

  const analyzed = cookies.map((cookie) => {
    const lower = cookie.toLowerCase();

    return {
      raw: cookie,
      httpOnly: lower.includes("httponly"),
      secure: lower.includes("secure"),
      sameSite:
        lower.includes("samesite=strict")
          ? "Strict"
          : lower.includes("samesite=lax")
          ? "Lax"
          : lower.includes("samesite=none")
          ? "None"
          : "Não informado"
    };
  });

  let risk = "low";
  let note = "Cookies configurados corretamente.";

  const weak = analyzed.some(
    (c) => !c.httpOnly || !c.secure || c.sameSite === "None"
  );

  if (weak) {
    risk = "high";
    note =
      "Cookies de sessão com flags inseguras (HttpOnly, Secure ou SameSite).";
  }

  return {
    found: true,
    cookies: analyzed,
    risk,
    note
  };
}
