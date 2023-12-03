<template>
  <div class="container">
    <div class="chat_screen">
      <ul>
        <li v-for="i in message_arr" :key="i" class="message_li">
          {{ i }}
        </li>
      </ul>
    </div>

    <div>
      <div>{{ nick }}</div>
      <input
        type="text"
        class="input_message"
        v-model="send_message"
        placeholder="메시지를 입력해주세요."
        @keyup.enter="send"
      />
      <button class="send_message_button" type="submit" @click="send"></button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      send_message: "",
      nick: "",
      message_arr: [],
    };
  },

  mounted() {
    this.cookie_read();
  },

  methods: {
    cookie_read: function () {
      axios.get("/cookie_confirm").then((res) => {
        this.nick = res.data;
      });
    },

    send: function () {
      console.log(this.send_message);
      axios
        .post("/send_message", {
          message: this.send_message,
        })
        .then((res) => {
          this.send_message = "";
          console.log(res);
          if (res.data.length >= 1) {
            this.message_arr.push(res.data);
            console.log(res.data);
          } else {
            console.log("전송실패");
          }
        });
    },
  },
};
</script>

<style>
.container {
  width: 100%;
  height: auto;
}

.message_li {
  position: relative;
  background: #eff9ff;
  border: 4px solid #99d6ff;
  height: fit-content;
  width: fit-content;
  max-width: 500px;
  padding: 20px;
  list-style: none;
  margin-bottom: 10px;
}

.message_li:after,
.message_li:before {
  right: 100%;
  top: 50%;
  border: solid transparent;
  content: "";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.message_li:after {
  border-color: rgba(136, 183, 213, 0);
  border-right-color: #eff9ff;
  border-width: 15px;
  margin-top: -15px;
}
.message_li:before {
  border-color: rgba(194, 225, 245, 0);
  border-right-color: #99d6ff;
  border-width: 20px;
  margin-top: -20px;
}
</style>
