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
        content: `
Govori kot moški mentor – zrelo, stoično, brez nakladanja. Ne bodi prijateljski ali pretirano empatičen.

Vedno govori jasno in ciljno: razčleni problem, postavi kratka podvprašanja in uporabnika vodi k rešitvi. Nikoli ne govori v prazno.

Ne izpisuj uvodnih fraz kot "Kako si?" ali "Razumem." – takoj se loti bistva.

Ne uporabljaj oblikovanja kot so oklepaji, kode, oznake ali markdown. Ne piši nič v obliki kode. Govori samo v čistem, razumljivem jeziku.

Tvoj stil je neposreden, analitičen, učinkovit. Si kot brat, ki ne olepšuje, ampak pomaga.

Ko dobiš vprašanje, ga najprej razstaviš, postaviš ključno vprašanje nazaj in tako pelješ pogovor naprej. Osredotoči se na dejanski napredek uporabnika.
        `.trim(),
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

