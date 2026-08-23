// Netlify Function: recibe las partes de contenido (imagen/PDF + prompt) desde el
// frontend y hace la llamada a la API gratuita de Gemini (Google) desde el servidor,
// para que la API key nunca viaje al navegador del usuario.

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Método no permitido." }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falta configurar GEMINI_API_KEY en las variables de entorno de Netlify." })
    };
  }

  let parts;
  try {
    const parsed = JSON.parse(event.body || "{}");
    parts = parsed.parts;
    if (!parts) throw new Error("missing parts");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Petición inválida." }) };
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 1000
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message = (data && data.error && data.error.message) || "Error al contactar con la API de Gemini.";
      return { statusCode: response.status, body: JSON.stringify({ error: message }) };
    }

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Error de conexión con la API de Gemini." }) };
  }
};
