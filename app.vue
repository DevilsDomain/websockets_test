<template>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
  </head>
  <div>
    <!-- login -->
    <div class="flex justify-center flex h-screen bg-color" v-if="!connected">
      <img src="~/assets/vectors/top.svg" alt="" class="absolute z-index scale blur-3xl top-blob">
      <div class="grid justify-items-center m-auto">
        <h1>CHAT</h1>
        <h3>ENTER A USER NAME TO JOIN</h3>
        <NicknameForm @submit="connectToServer"/>
      </div>
      <img src="~/assets/vectors/bot.svg" alt="" class="absolute z-index scale blur-3xl bot-blob">
    </div>
    <!-- login -->
    <!-- chat-log -->
    <div v-if="connected">
      <h1>CHAT</h1>
      <div class="flex flex-row gap-4">
        <div class="size border border-black	border-2">
          <h4>ONLINE</h4>
          <ul>
            <li v-for="user in connectedUsers" :key="user">{{ user }}</li>
          </ul>
        </div>
        
        <ChatLog :chat-log="chatLog"/>
      </div>
    </div>
      <input v-model="text" @keyup.enter="send"  @focus="startTyping(nickname)" @blur="stopTyping(nickname)" class="border border-gray-100" v-if="connected"/>
      <!-- <input type="file" @change="handleFileUpload" id="file-input" v-if="connected"/> -->
      <button @click="send" v-if="connected">SEND</button>
  
    <!-- chat-log -->
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
// const reader = new FileReader();




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
<style scoped>
* {
  z-index: 1;
}
h1 {
  font-size: 143px;
  line-height: 174px;
}

h3 {
  font-size: 30px;
  font-weight: 300;
  font-size: 30px;
  line-height: 39px;
  font-weight: 200;
  letter-spacing: 0.635em;
  padding-bottom: 40px;

}
.bg-color {
  background-color: #EFEFEF;
}

.z-index {
    z-index: 0;
}

.scale {
  transform: scale();
}

.top-blob {
  left: 120px;
  top: 50px
}

.bot-blob {
  bottom: 30px;
  right: 100px;
}

.size {
width: 198px;
height: 576px;
}


</style>