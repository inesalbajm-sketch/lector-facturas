# Lector de Facturas

App de una sola página (`index.html`) que lee facturas (foto o PDF) y explica el
consumo en lenguaje sencillo. La llamada a la API de Gemini se hace desde una
función serverless de Netlify (`netlify/functions/analyze-invoice.js`), así que
la API key nunca se expone en el navegador.

Usa la API gratuita de Gemini (Google), modelo `gemini-2.5-flash`, que incluye
comprensión de imágenes y PDF sin coste dentro de los límites del nivel
gratuito (unas cuantas peticiones por minuto y al día — de sobra para uso
personal). No hace falta tarjeta de crédito para generar la clave.

## Desplegar en Netlify

1. **Consigue una API key gratuita de Gemini**
   Entra en [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   (Google AI Studio) → "Create API key". Es gratuita, no pide tarjeta.
   Los límites del nivel gratuito pueden variar; para consultar los tuyos en
   cualquier momento, mira la sección "Quotas" de Google AI Studio.

2. **Sube esta carpeta a Netlify**
   - Opción rápida: arrastra la carpeta entera a
     [app.netlify.com/drop](https://app.netlify.com/drop).
   - Opción recomendada (para poder actualizarla luego): sube la carpeta a un
     repositorio de GitHub y conéctalo en Netlify como "New site from Git".

3. **Configura la variable de entorno**
   En el panel del site: *Site configuration → Environment variables → Add a
   variable*.
   - Key: `GEMINI_API_KEY`
   - Value: la clave que has generado en el paso 1

4. **Vuelve a desplegar**
   Si ya habías desplegado antes de añadir la variable, lanza un nuevo deploy
   (*Deploys → Trigger deploy*) para que la función la recoja.

5. Abre la URL de tu site. Ya puedes hacer una foto o subir un PDF de una
   factura y verás el análisis, gratis.

## Probar en local (opcional)

Con [Netlify CLI](https://docs.netlify.com/cli/get-started/) instalado:

```bash
npm install -g netlify-cli
netlify dev
```

Crea un archivo `.env` en esta carpeta con:

```
GEMINI_API_KEY=tu_clave_aqui
```

`netlify dev` levanta tanto la página como la función en local, sin tener que
desplegar cada vez que cambies algo.

## Si algún día quieres más capacidad

Si el nivel gratuito se te queda corto (mucho volumen, muchas fotos de golpe),
Gemini también tiene tier de pago con los mismos endpoints — solo tendrías que
activar la facturación en el proyecto de Google Cloud asociado a tu API key,
sin tocar nada del código.
