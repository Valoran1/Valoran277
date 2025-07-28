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
          content:
            "Deluješ kot moški AI mentor. Sprašuj podvprašanja, razčleni probleme in vodi uporabnika k rešitvi kot brat – jasno, jedrnato, brez nakladanja.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    let fullMessage = "";

    for await (const part of stream) {
      const content = part.choices[0]?.delta?.content;
      if (content) {
        fullMessage += content;
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: fullMessage }),
    };
  } catch (error) {
    console.error("Chat error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Chat failed" }),
    };
  }
};

