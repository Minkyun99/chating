require("dotenv").config();
const { Server } = require("socket.io");
const express = require("express");
const history = require("connect-history-api-fallback");
const path = require("path");
const logger = require("morgan");
const http = require("http");
const cookieParser = require("cookie-parser");
// const VueCookies = require("vue-cookies");
const { createProxyMiddleware } = require("http-proxy-middleware");
const request = require("request");
// const VSchema = require("./mdb.cjs");
// const Counter_Schema = require("./counter_db.cjs");
// const Board_Schema = require("./board_db.js");
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(history());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080;
const _path = path.join(__dirname, "./dist");

app.use("/", express.static(_path));
app.use(logger("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cookieParser());

/*id_pwd confirm*/
app.post("/id", (req, res) => {
  console.log(req.body.id);
  console.log(req.body.pwd);
  const id = req.body.id;
  const pwd = req.body.pwd;
  if (id == "manito" && pwd == "manito1127") {
    res.send("1");
  } else {
    res.send("0");
  }
  // async () => {
  // };
});

/*cookie*/
app.post("/cookie", (req, res) => {
  const id = req.body.id;
  console.log("manito" + id);
  res.cookie("MANITO", id);
  res.render("Cookie", { MANITO: id });
});

app.get("/cookie_confirm", (req, res) => {
  (async () => {
    const my_manito = req.cookies.MANITO;
    console.log(my_manito);
    res.send(my_manito);
  })();
});

/*send_message*/
app.post("/send_message", (req, res) => {
  console.log(req.body.message);
  const message = req.body.message;
  if (message.length >= 1) {
    res.send(message);
    console.log(message);
  } else {
    res.send("1");
  }
  // async () => {
  // };
});

/*회원가입 시 DB에 고객 정보 저장*/
app.post("/join", (req, res) => {
  const name = req.body.name;
  const id = req.body.id;
  const pwd = req.body.pwd;
  const Nickname = req.body.Nickname;
  const gender = req.body.gender;
  const age = req.body.age;
  const hobby = req.body.hobby;
  const PhoneNumber = req.body.phoneNumber;
  const identification = req.body.identification;

  console.log(id, pwd, identification);
  (async () => {
    const _data = {
      name,
      id,
      pwd,
      Nickname,
      gender,
      age,
      hobby,
      PhoneNumber,
      identification,
    };
    const vs = await new VSchema(_data);
    const t = await vs.save();
    console.log(t);
    res.send("input_data_successful");
  })();
});

/*회원 가입 시 아이디 중복 여부*/
app.post("/id_check", async (req, res) => {
  const user_id_check = req.body.id;
  console.log(user_id_check);
  (async () => {
    const find_id = await VSchema.find(
      { id: user_id_check },
      { _id: 0, __v: 0 }
    );
    if (find_id.length > 0) {
      res.send("2"); //id가 존재할 경우 '2'를 보냄.
    } else {
      res.send("0"); //id가 존재하지 않는 경우 '1'을 보냄.
    }
  })();
});

/*아이디 찾기*/
app.post("/find_id", async (req, res) => {
  const find_name = req.body.name;
  const find_phoneNumber = req.body.phoneNumber;
  (async () => {
    const name = await VSchema.find(
      { name: find_name, PhoneNumber: find_phoneNumber },
      { __v: 0 }
    );
    if (name.length > 0) {
      console.log(name);
      res.send(name);
      console.log(name[0].id);
    } else {
      res.send("1");
    }
  })();
});

/*비밀번호 변경*/
app.post("/pwd_change", async (req, res) => {
  const change_pwd_id = req.body.id;
  const change_phoneNumber_pwd = req.body.pwd;
  (async () => {
    const change_pwd = await VSchema.updateOne(
      { id: change_pwd_id },
      {
        $set: {
          pwd: change_phoneNumber_pwd,
        },
      },
      { upsert: true }
    );
    console.log(change_pwd);
    console.log(change_phoneNumber_pwd);
    res.send("1");
  })();
});

/*프로필 정보 불러오기*/
app.post("/customer", (req, res) => {
  let nickname = req.body.nickname;
  console.log(nickname);
  (async () => {
    const profile = await VSchema.find({ Nickname: nickname }, { __v: 0 });

    res.send(profile);
    console.log(profile);
  })();
});

/*프로필 비밀번호 check*/
app.post("/profile_pwd_check", (req, res) => {
  const nick = req.body.nick;
  const pwd = req.body.pwd;
  (async () => {
    const profile_check = await VSchema.find(
      { Nickname: nick, pwd: pwd },
      { __v: 0 }
    );
    console.log(profile_check);
    if (profile_check.length >= 1) {
      res.send("1");
    } else res.send("2");
  })();
});

/*프로필 수정*/
app.post("/profile_change", (req, res) => {
  const profile_id = req.body.id;
  const profile = req.body.profile;
  const introduce = req.body.introduce;
  (async () => {
    const change_profile = await VSchema.updateOne(
      { id: profile_id },
      {
        $set: {
          profile: profile,
          introduce: introduce,
        },
      },
      { upsert: true }
    );
    console.log(change_profile);
    res.send("1");
  })();
});

/*게시판 글번호 불러오기*/
app.get("/numbering", (req, res) => {
  (async () => {
    const number = await Counter_Schema.find(
      { name: "총 게시물 개수" },
      { __v: 0 }
    );

    res.send(number);
    console.log(number);

    const notice_number = number[0].totalPosts;
    const update_totalPosts = await Counter_Schema.updateOne(
      { name: "총 게시물 개수" },
      {
        $set: {
          totalPosts: notice_number + 1,
        },
      },
      { upsert: true }
    );
    console.log(update_totalPosts);
  })();
});

/*mongoDB 게시글 작성 저장*/
app.post("/write", (req, res) => {
  const title = req.body.title;
  const writer = req.body.writer;
  const img = req.body.img;
  const content = req.body.content;
  const date = req.body.date;
  (async () => {
    const counter_num = await Counter_Schema.find(
      { name: "총 게시물 개수" },
      { __v: 0 }
    );

    const No = counter_num[0].totalPosts;

    console.log(No, title, writer, img, content, date);

    const _data = {
      No,
      title,
      writer,
      img,
      content,
      date,
    };

    const vs = await new Board_Schema(_data);
    const t = await vs.save();
    res.send("1");
    console.log(t);
  })();
});

/*board_read*/
app.get("/get_board", (req, res) => {
  (async () => {
    const get = await Board_Schema.find({}).sort({ No: -1 });
    res.send(get);
    // console.log(get)
  })();
});

/*게시글 모달에 띄우기*/
app.post("/board_modal", (req, res) => {
  const find_board = req.body.title;
  (async () => {
    const get = await Board_Schema.find({ title: find_board });
    res.send(get);
    console.log(get);
  })();
});

app.listen(port, () => {
  console.log(port + "에서 서버동작 완료.");
});
