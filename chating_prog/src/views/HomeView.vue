<template>
  <div class="login_container">
    <table class="login_table_container">
      <tr>
        <td>
          <input
            type="id"
            class="id"
            v-model="id"
            placeholder="닉네임을 입력해주세요."
          />
        </td>
      </tr>
      <td>
        <input type="pwd" class="pwd" v-model="pwd" @keyup.enter="login" />
      </td>
      <tr>
        <td>
          <button @click="login" class="login_button">login</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      id: "",
      pwd: "",
    };
  },
  methods: {
    login: function () {
      axios
        .post("/id", {
          id: this.id,
          pwd: this.pwd,
        })
        .then((res) => {
          if (res.data == "1") {
            console.log(res.data);
            alert("당신은 저의 마니또가 맞습니다.");

            this.$router.push("/about");
          } else {
            console.log("전송실패");
          }
        });
      axios.post("/cookie", {
        id: this.id,
      });
    },
  },
};
</script>

<style>
.login_container {
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 15%;
  justify-content: center;
}

.id,
.pwd {
  width: 40vh;
  height: 5vh;
  border-radius: 15px;
  font-size: x-large;
}

.login_button {
  width: 10vh;
  height: 3vh;
  border-radius: 15px;
}

.login_button:hover {
  transform: scale(1.1);
  background-color: rgb(75, 137, 220);
}
/* .login_table_container {
  align-items: center;
  display: flex;
  justify-content: center;
} */
</style>
