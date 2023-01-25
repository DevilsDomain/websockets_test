<template>
  <div>
    <NicknameForm @submit="connectToServer" v-if="!connected"/>
    <ChatLog :chat-log="chatLog" v-if="connected" />

    <input v-model="text" @keyup.enter="send" class="border border-gray-100" v-if="connected"/>
    <button @click="send" v-if="connected">SEND</button>
  </div>
</template>

<script setup>
// const { $socket } = useNuxtApp();
import io from "socket.io-client";
import ChatLog from "./components/ChatLog.vue";
const config = useRuntimeConfig();

const chatLog = ref("");
const text = ref("");
const nickname = ref(""); 
let socket;
const connected = ref(false);


function addToChat(m) {
  chatLog.value += `<div>${m}</div>`;
}

function send() {
  socket.emit("message", text.value);
  addToChat(text.value); // optimistic UI
  text.value = "";
}
function connectToServer(nickname) {
  socket = io(config.public.wssUrl);
  socket.emit('join', { id: socket.id, nickname: nickname });
  connected.value = true;

  socket.on("message", (data) => {
    console.log(data, "<<<<");
    addToChat(data.message);
  });
}
</script>
