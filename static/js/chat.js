const chatDiv = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  input.value = "";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  const responseText = data.response || `Error: ${data.error}`;
  appendMessage(responseText, "bot");
});

function appendMessage(text, sender) {
  const messageWrapper = document.createElement("div");
  messageWrapper.classList.add("message-wrapper", sender);

  const senderDiv = document.createElement("div");
  senderDiv.classList.add("sender-name");
  senderDiv.textContent = sender === "user" ? "You" : "Bot";

  const bubbleDiv = document.createElement("div");
  bubbleDiv.classList.add("bubble");
  bubbleDiv.innerHTML = marked.parse(text);

  if (sender === "user") {
    messageWrapper.appendChild(bubbleDiv);
    messageWrapper.appendChild(senderDiv);
  } else {
    messageWrapper.appendChild(senderDiv);
    messageWrapper.appendChild(bubbleDiv);
  }

  chatDiv.appendChild(messageWrapper);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}
