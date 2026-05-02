const API_KEY = "ai-2026";

function add(msg, who){
  document.getElementById("chat").innerHTML +=
  `<p><b>${who}:</b> ${msg}</p>`;
}

// 💬 AI RESPONSE
async function send(){
  let text = document.getElementById("input").value;
  if(!text) return;

  add(text, "You");

  try {
    let res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: text }]
      })
    });

    let data = await res.json();
    let reply = data.choices[0].message.content;

    add(reply, "JARVIS");
    speak(reply);

  } catch (err) {
    add("Error connecting AI", "SYSTEM");
  }
}

// 🔊 VOICE OUTPUT
function speak(text){
  let msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}

// 🎤 VOICE INPUT
function startVoice(){
  let rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang = "en-US";

  rec.onresult = function(e){
    document.getElementById("input").value = e.results[0][0].transcript;
    send();
  };

  rec.start();
}

// STATUS
document.getElementById("status").innerText = "System Ready";
