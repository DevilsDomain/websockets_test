<template>
  <div>
    <NicknameForm @submit="connectToServer" v-if="!connected"/>
    <ChatLog :chat-log="chatLog" v-if="connected" />

    <!-- @blur="stopTyping(nickname)" -->
    <input v-model="text" @keyup.enter="send"  @focus="startTyping(nickname)" @blur="stopTyping(nickname)" class="border border-gray-100" v-if="connected"/>
    <button @click="send" v-if="connected">SEND</button>
  </div>

  <div>
    <ul>
        <li v-for="user in users" :key="user">{{ user }}</li>
    </ul>
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
const typing = ref(false);
const typingValue = ref("")
const users = ref([])



function addToChat(m) {
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

// propably not useful to display that the user stopped typing after they have sent the message, but up to preference.

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
</script>
