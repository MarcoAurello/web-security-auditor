// src/httpClient.js
import axios from "axios";
import https from "https";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false // IGNORA validação SSL (apenas para HOMOLOGAÇÃO)
});

export async function httpGet(url) {
  const start = Date.now();
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      validateStatus: () => true,
      timeout: 10000,
      httpsAgent
    });

    const elapsed = Date.now() - start;

    return {
      ok: true,
      status: response.status,
      headers: response.headers,
      data: response.data,
      timeMs: elapsed
    };
  } catch (error) {
    const elapsed = Date.now() - start;
    return {
      ok: false,
      error: error.message,
      timeMs: elapsed
    };
  }
}
