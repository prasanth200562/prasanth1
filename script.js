let currentMode = 'chat';

function setMode(mode) {
  currentMode = mode;
  document.getElementById("chat-container").style.display = mode === 'chat' ? 'flex' : 'none';
  document.getElementById("imageResults").style.display = mode === 'image' ? 'flex' : 'none';

  document.getElementById("chatModeBtn").classList.remove("active");
  document.getElementById("imageModeBtn").classList.remove("active");

  if (mode === 'chat') {
    document.getElementById("chatModeBtn").classList.add("active");
  } else {
    document.getElementById("imageModeBtn").classList.add("active");
  }
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  if (currentMode === "chat") {
    const chatbox = document.getElementById("chat-container");

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = message;
    chatbox.appendChild(userMsg);

    const botContainer = document.createElement("div");
    botContainer.style.display = "flex";
    botContainer.style.flexDirection = "column";
    botContainer.style.alignItems = "flex-end";

    const botMsg = document.createElement("div");
    botMsg.className = "message bot";
    botMsg.textContent = "Typing...";
    botContainer.appendChild(botMsg);

    const watermark = document.createElement("div");
    watermark.className = "watermark";
    watermark.textContent = "— Prasanth AI";
    botContainer.appendChild(watermark);

    chatbox.appendChild(botContainer);
    chatbox.scrollTop = chatbox.scrollHeight;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      botMsg.textContent = data.choices[0].message.content;
    } catch (e) {
      botMsg.textContent = "Error getting response.";
    }

    chatbox.scrollTop = chatbox.scrollHeight;
  } else {
    fetchImages(message);
  }

  input.value = "";
}

async function fetchImages(query) {
  const apiKey = "48536201-64305dfb5a6dde8ac3fcb7eca";
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=6`;
  const res = await fetch(url);
  const data = await res.json();

  const container = document.getElementById("imageResults");
  container.innerHTML = "";
  data.hits.forEach(hit => {
    const img = document.createElement("img");
    img.src = hit.webformatURL;
    img.className = "image-thumb";
    container.appendChild(img);
  });
}

setMode('chat');

