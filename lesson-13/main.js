// main.js
"use strict";

const port = 3000,
  express = require("express"),
  layouts = require("express-ejs-layouts"),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  app = express(),
  MongoDB = require("mongodb").MongoClient,
  dbURL = 'mongodb+srv://ut-node:V1g5HfxMKHhE4f2m@ut-node.4o7ookk.mongodb.net/?retryWrites=true&w=majority&appName=ut-node',
  dbName = 'ut-node';


// @TODO: 로컬 MongoDB 데이터베이스 서버 연결 설정
MongoDB.connect(dbURL, (error, client) => {
  if (error) throw error;

  let db = client.db(dbName);
  db.collection("contacts")
  .find()
  .toArray((error, data) => {
    if (error) throw error;
    console.log(data);
  });

  db.collection("contacts")
  .insertOne({
    name: "Andrew",
    job: "Doctor",
    location: "Seoul"
  }, (error, result) => {
    if (error) throw error;
    console.log(data);
  });
})
.then(() => {
  console.log("DB connected")})
  .catch((error) => {
    console.log("DB connecting FAILED");
    console.log(error);
    process.exit(1);
});

app.set("port", process.env.PORT || port);
app.set("view engine", "ejs");

app.use(layouts);
app.use(express.static("public"));

app.get("/", homeController.getHomePage);
app.get("/name/:myName", homeController.respondWithName2);

/**
 * Listing 11.4 (p. 169)
 * 사용자 정의 메시지를 통한 에러와 없는 라우트 처리
 */
app.use(errorController.logErrors);
app.use(errorController.resNotFound); // main.js에 에러 처리 미들웨어 추가
app.use(errorController.resInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
