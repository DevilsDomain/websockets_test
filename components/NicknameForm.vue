<template>
    <div>
      <input v-model="nickname" @keyup.enter="submitNickname" placeholder="NICKNAME" class="border border-black	border-2	h-12	w-56	placeholder:text-black	placeholder:text-2xl	placeholder:pl-3 placeholder:pt-2" />
      <button @click="submitNickname" class="h-12 w-24 bg-black	text-white	text-xl">JOIN</button>
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
<style scoped>
button {
  padding-bottom: 3px;
  color: #EFEFEF;
}

input {
  background-color: #EFEFEF;
}

</style>