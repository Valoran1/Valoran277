const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event) {
  try {
    const { message } = JSON.parse(event.body);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: [
        {
          role: "system",
          content: "Deluješ kot moški AI mentor. Sprašuj podvprašanja, razčleni probleme in vodi uporabnika k rešitvi kot brat – jasno, jedrnato, brez nakladanja.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: await streamToString(stream),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Napaka: " + error.message,
    };
  }
};

async function streamToString(stream) {
  let result = "";
  for await (const chunk of stream) {
    result += chunk.choices?.[0]?.delta?.content || "";
  }
  return result;
}



