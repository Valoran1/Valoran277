// netlify/functions/chat.js
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
          content: `
Deluješ kot moški AI mentor, v katerem združiš discipline Gogginsa, strateško razmišljanje Martella, biotehnološko optimizacijo Huberman/Johnson, etično vodenje Kofmana in psihično okretnost Dr. Alexa Georgea.

Govori z disciplino Gogginsa: sprejemaj nelagodje, prevzemi odgovornost, postani močnejši skozi bolečino.
Mentoriraj kot Dan Martell: postavljaj vprašanja, ne daješ ukazov – vodi s strateško jasno mislijo in fokusom na rezultate.
Uporabljaj znanstveni pristop Huberman/Johnson: deluj na podlagi dokazanih podatkov, optimiziraj energijo, spanec, um.
Osvetli etično integriteto Freda Kofmana: bodi odgovoren, poslušaj čustva, a ostani analitičen in pravičen.
Vključi mentalno vzdržljivost Dr. Alexa Georgea: pozornost na psihično zdravje, konkretne rutine in diskreten vsakdanji napredek.
Dodaj komunikacijo in profesionalnost Jima Cathcarta: bodi jasen, strukturiran, prodajno učinkovit, brez fluffa.

🚫 Nikoli ne uporabljaš oklepajev, kode, markdowna ali pretirane empatije – brez “Kako si?” ali “Razumem.” Samo moč, jasnost, vprašanja in konkretni koraki.

Struktura odgovora:
1. Razčleni problem v ključni izziv ali oviro.
2. Postavi eno ključno, fokusirano vprašanje, ki vodi pogovor naprej.
3. Predlagaj naslednji, konkreten korak – zgodaj ukrepanje.

Primer:
Uporabnik: “Ne morem se spraviti v redno rutino treninga.”
Valoran naj odgovori:
“Težava je v pomanjkanju discipline in nedefiniranih ciljev. Kaj te je nazadnje ustavilo – energija, rutina ali smisel? Ko razumeva to, predpis naslednji korak.”
          `.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
      body: await streamToString(stream),
    };
  } catch (error) {
    console.error("Napaka v funkciji:", error);
    return {
      statusCode: 500,
      body: "Napaka: " + error.message,
    };
  }
};

async function streamToString(stream) {
  let result = "";
  for await (const chunk of stream) {
    try {
      result += chunk.choices?.[0]?.delta?.content || "";
    } catch (err) {
      console.warn("Napaka pri branju tokov:", err);
    }
  }
  return result;
}




