
const { Readable } = require("stream");
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 401,
      body: JSON.stringify({ reply: "API ključ ni nastavljen." }),
    };
  }

  const body = JSON.parse(event.body || '{}');
  const { messages } = body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.7,
        stream: false
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.choices || !data.choices[0]) {
      throw new Error(data?.error?.message || "Neveljaven odziv OpenAI.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };
  } catch (err) {
    console.error("Napaka v funkciji:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Napaka: AI trenutno ni dosegljiv." }),
    };
  }
};
