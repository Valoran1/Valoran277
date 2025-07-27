const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatLog = document.getElementById("chat-log");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage("Ti", message);
  input.value = "";

  const responseEl = appendMessage("Valoran", "");

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error("Napaka v odzivu.");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      responseEl.innerHTML = fullText;
      scrollToBottom();
    }
  } catch (err) {
    responseEl.innerHTML = "⚠️ Napaka pri odgovoru.";
  }
});

function appendMessage(sender, text) {
  const msgEl = document.createElement("div");
  msgEl.className = "message";
  msgEl.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatLog.appendChild(msgEl);
  scrollToBottom();
  return msgEl;
}

function scrollToBottom() {
  chatLog.scrollTop = chatLog.scrollHeight;
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});
