import "dotenv/config";

// Google se poocho: is key par kaun se models chalte hain?
const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
  headers: { "x-goog-api-key": process.env.GEMINI_API_KEY },
});
const data = await res.json();

if (!res.ok) {
  console.log("Error:", res.status, JSON.stringify(data.error, null, 2));
} else {
  // sirf wo models jo text generate karte hain
  data.models
    .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
    .forEach((m) => console.log(m.name));
}