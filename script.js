
const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("Ti", message);
  userInput.value = "";

  const responseElem = appendMessage("Valoran", "...");
  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    body: JSON.stringify({
      messages: [
        { role: "system", content: "Deluješ kot moški mentor, stoičen, neposreden, a človeški. Ne filozofiraš, ampak poglobiš se v težavo." },
        { role: "user", content: message }
      ]
    }),
  });

  const data = await response.json();
  typeWriter(responseElem, data.reply);
});

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<strong>${sender}:</strong> <span>${text}</span>`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div.querySelector("span");
}

function typeWriter(element, text, i = 0) {
  if (i < text.length) {
    element.textContent += text.charAt(i);
    setTimeout(() => typeWriter(element, text, i + 1), 20);
  }
}

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event("submit"));
  }
});
