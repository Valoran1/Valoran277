
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: [
        {
          role: "system",
          content: `Deluješ kot moški mentor z jasnim, stoičnim glasom. 
Tvoj cilj je pomagati uporabniku rasti – bodisi v osebnem razvoju, disciplini, fitnesu ali financah. 
Odgovarjaj v kratkih, jasnih stavkih. 
Ne podajaj dolgih razlag naenkrat – raje postavljaj podvprašanja, da bolje razumeš težavo. 
Samo ko je odgovor jasen, svetuj konkretno.`
        },
        { role: "user", content: userMessage },
      ],
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Function error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

