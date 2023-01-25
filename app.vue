<template>
  <div>
    <NicknameForm @submit="connectToServer" v-if="!connected"/>
    <ChatLog :chat-log="chatLog" v-if="connected" />

    <input v-model="text" @keyup.enter="send"  @focus="startTyping(nickname)" @blur="stopTyping(nickname)" class="border border-gray-100" v-if="connected"/>
    <button @click="send" v-if="connected">SEND</button>

    <div>
    <ul>
      <li v-for="user in connectedUsers" :key="user">{{ user }}</li>
    </ul>
  </div>

  </div>
</template>

<script setup>
// const { $socket } = useNuxtApp();
import io from "socket.io-client";
import ChatLog from "./components/ChatLog.vue";
import { ref, computed } from 'vue'

const config = useRuntimeConfig();
const chatLog = ref("");
const text = ref("");
const nickname = ref(""); 
let socket;
const connected = ref(false);
const typing = ref(false);
const typingValue = ref("")
const users = ref({});


function addToChat(m) {
  if (m.startsWith("http") || m.startsWith("www")) {
    m = `<a href="${m}" target="_blank">${m}</a>`;
  }
  chatLog.value += `<div>${m}</div>`;
}

function send() {
  socket.emit("message", text.value);
  addToChat(text.value); // optimistic UI
  text.value = "";
}

function startTyping(nickname) {
  typingValue.value = text.value
  typing.value = true;
  socket.emit("typing", nickname);
}



function stopTyping(nickname) {
  typingValue.value = ""
  typing.value = false;
  socket.emit("stop_typing", nickname);
}

function connectToServer(nickname) {
  socket = io(config.public.wssUrl);
  socket.emit('join', { id: socket.id, nickname: nickname });
  connected.value = true;

  socket.on("message", (data) => {
    console.log(data, "<<<<");
    addToChat(data.message);
  });
  socket.on("updateUsers", (data) => {
    users.value = data;
  });
}


const connectedUsers = computed(() => {
  return users.value ? Object.entries(users.value).filter(([user, status]) => status).map(([user]) => user) : []
});

</script>
