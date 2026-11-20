import "dotenv/config";

// list-models.js se jo naam mile (models/ ke bina), wo yahan daalo
const MODEL = "gemini-flash-lite-latest";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// ms milliseconds ruko
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function testAI() {
  // Max 4 baar try, har baar zyada ruko: 2s, 4s, 8s
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "'Revision karna hai' task ko 3 chhote steps mein todo." }] }],
      }),
    });
    const data = await res.json();

    // Success
    if (res.ok) {
      console.log("AI ka jawab:", data.candidates[0].content.parts[0].text);
      return;
    }

    // 503 (busy) ya 429 (limit) = temporary, to ruk ke dobara try karo
    if ((res.status === 503 || res.status === 429) && attempt < 4) {
      const wait = 2000 * 2 ** (attempt - 1);
      console.log(`Try ${attempt} fail (${res.status}), ${wait / 1000}s baad dobara...`);
      await sleep(wait);
      continue;
    }

    // Koi aur error ya try khatam
    console.log("Error:", res.status, JSON.stringify(data.error, null, 2));
    return;
  }
}

testAI();