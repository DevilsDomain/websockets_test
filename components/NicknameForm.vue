<template>
    <div>
      <input v-model="nickname" @keyup.enter="submitNickname" placeholder="Enter your nickname" class="border border-gray-100" />
      <button @click="submitNickname">Join Chat</button>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    data() {
      return {
        nickname: ''
      }
    },
    methods: {
      submitNickname() {
        // emit an event with the nickname
        this.$emit('submit', this.nickname)
      }
    }
  }
  </script>