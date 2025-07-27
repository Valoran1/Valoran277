const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event) {
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

  return new Response(streamToReadable(stream), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

function streamToReadable(stream) {
  const encoder = new TextEncoder();
  const reader = stream[Symbol.asyncIterator]();
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(encoder.encode(value.choices[0]?.delta?.content || ""));
      }
    },
  });
}

