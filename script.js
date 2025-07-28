const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatLog = document.getElementById("chat-log");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    appendMessage("bot", "Napaka pri pošiljanju sporočila.");
    return;
  }

  const reader = response.body.getReader();
  let botMessage = "";
  appendMessage("bot", ""); // create empty message

  const typewriter = document.querySelector(".chat-message.bot:last-child");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    botMessage += chunk;
    typewriter.textContent = botMessage;
  }
});

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.className = `chat-message ${role}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});

