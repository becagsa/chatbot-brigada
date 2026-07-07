const chat = document.getElementById("chat");
const mensagem = document.getElementById("mensagem");
const btnEnviar = document.getElementById("btnEnviar");
const btnLimpar = document.getElementById("btnLimpar");

const API_URL = "http://127.0.0.1:5000/chat";

const mensagemInicial =
  "Olá! Sou um assistente especializado em Brigada de Incêndio em Empresas. Posso ajudar com dúvidas sobre prevenção, evacuação, extintores, classes de incêndio e procedimentos básicos de emergência.";

function adicionarMensagem(texto, tipo) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.classList.add(tipo);

  div.textContent = texto;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function enviarMensagem() {
  const texto = mensagem.value.trim();

  if (texto === "") {
    alert("Digite uma pergunta antes de enviar.");
    return;
  }

  adicionarMensagem(texto, "user");
  mensagem.value = "";

  adicionarMensagem("Analisando sua pergunta...", "bot");

  const mensagensBot = document.querySelectorAll(".bot");
  const mensagemCarregando = mensagensBot[mensagensBot.length - 1];

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mensagem: texto
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mensagemCarregando.textContent =
        dados.erro || "Erro ao processar a mensagem.";
      return;
    }

    mensagemCarregando.textContent = dados.resposta;

  } catch (erro) {
    mensagemCarregando.textContent =
      "Erro ao conectar com o backend. Verifique se o servidor Python está em execução.";
    console.error(erro);
  }
}

btnEnviar.addEventListener("click", enviarMensagem);

mensagem.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    enviarMensagem();
  }
});

btnLimpar.addEventListener("click", function() {
  chat.innerHTML = "";
  adicionarMensagem(mensagemInicial, "bot");
});