// ─── CHAT LOGIC ───
const input = document.getElementById("chatInput");

input.addEventListener("input", async () => {
  const lang = document.getElementById("langSelect").value;

  if (lang === "en") return;

  const text = input.value;

  try {
    const res = await fetch(
      `https://inputtools.google.com/request?text=${text}&itc=${lang}-t-i0-und&num=1`
    );

    const data = await res.json();

    if (data[0] === "SUCCESS") {
      input.value = data[1][0][1][0]; // 🔥 converted text
    }

  } catch (e) {
    console.log("Transliteration error");
  }
});


let chatHistory = [];
let isLoading = false;

// 🔥 Load saved chat
const savedChat = JSON.parse(localStorage.getItem("chat"));

if (savedChat) {
  savedChat.forEach(msg => {
    appendChatMsg(msg.role, msg.text);
  });
}

async function sendChat(text) {
  if (isLoading) return;

  const input = document.getElementById('chatInput');
  const msg = text || input.value.trim();
  if (!msg) return;

  const chips = document.getElementById('quickChips');
  if (chips) chips.remove();

  input.value = '';
  appendChatMsg('user', msg);

  isLoading = true;
  const typingId = appendTyping();

  try {
    const lang = document.getElementById("langSelect")?.value || "en";

    // ✅ FIX: define username OUTSIDE
   const user = JSON.parse(localStorage.getItem("pallottibot_user"));
const username = user ? user.username : null; 

    const res = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: msg,
        lang: lang,
        username: username
      })
    });

    const data = await res.json();
    removeTyping(typingId);

    appendChatMsg('bot', formatMsg(data.reply));

  } catch (e) {
    removeTyping(typingId);
    appendChatMsg('bot', '⚠️ Cannot connect to backend 😢');
    console.log(e);
  }

  isLoading = false;
}

// ─── FORMAT RESPONSE ───
function formatMsg(t) {
  return t
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\n- /g, '<br>• ')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// ─── APPEND MESSAGE ───
function appendChatMsg(role, text) {
  const msgs = document.getElementById('chat-messages');

  const div = document.createElement('div');
  div.className = `chat-msg ${role === 'user' ? 'user' : ''}`;
  div.innerHTML = `
    <div class="msg-av ${role === 'user' ? 'u' : 'b'}">${role === 'user' ? '👤' : 'P'}</div>
    <div class="msg-bubble ${role === 'user' ? 'user' : 'bot'}">${text}</div>
  `;

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;

  // 🔥 SAVE CHAT TO LOCAL STORAGE
  chatHistory.push({ role, text });
  localStorage.setItem("chat", JSON.stringify(chatHistory));
}

function clearChat() {
  localStorage.removeItem("chat");
  document.getElementById("chat-messages").innerHTML = "";
  chatHistory = [];
}

// ─── TYPING INDICATOR ───
function appendTyping() {
  const msgs = document.getElementById('chat-messages');
  const id = 'ty' + Date.now();

  const div = document.createElement('div');
  div.className = 'chat-msg';
  div.id = id;

  div.innerHTML = `
    <div class="msg-av b">P</div>
    <div class="msg-bubble bot">
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;

  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ─── QUICK BUTTONS ───
function quickSend(q) {
  sendChat(q);
}

// ─── ENTER KEY SUPPORT ───
function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
}

// ─── AUTO GROW TEXTAREA ───
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

// ─── MOBILE TOGGLE ───
function toggleChat() {
  const sidebar = document.getElementById('chat-sidebar');
  sidebar.classList.toggle('open');

  document.getElementById('chat-toggle').textContent =
    sidebar.classList.contains('open') ? '✕' : '💬';
}

// ─── VOICE INPUT ───
function startVoice() {
  const input = document.getElementById("chatInput");
  const voiceBtn = document.querySelector(".voice-btn");

  voiceBtn.style.backgroundColor = "#b07d14";

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-IN";
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.start();

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    input.value = transcript;

    if (event.results[event.results.length - 1].isFinal) {
      sendChat(transcript);
      input.value = "";
      voiceBtn.style.backgroundColor = "#c8941f";
    }
  };

  recognition.onerror = (event) => {
    alert("Voice error: " + event.error);
    voiceBtn.style.backgroundColor = "#c8941f";
  };

  recognition.onend = () => {
    voiceBtn.style.backgroundColor = "#c8941f";
  };
}
const hindiMap = {
  "namaste": "नमस्ते",
  "kya": "क्या",
  "hai": "है",
  "kaise": "कैसे",
  "ho": "हो"
};

const marathiMap = {
  "namaskar": "नमस्कार",
  "kay": "काय",
  "ahe": "आहे",
  "tumhi": "तुम्ही"
};

document.getElementById("chatInput").addEventListener("input", function () {
  const lang = document.getElementById("langSelect").value;
  let text = this.value.toLowerCase();

  if (lang === "hi") {
    Object.keys(hindiMap).forEach(word => {
      text = text.replaceAll(word, hindiMap[word]);
    });
  }

  if (lang === "mr") {
    Object.keys(marathiMap).forEach(word => {
      text = text.replaceAll(word, marathiMap[word]);
    });
  }

  this.value = text;
});

