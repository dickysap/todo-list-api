const express = require("express");
const router = express.Router();
const { createFile, readNotes } = require("../pkg/filesystem");
const Jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { validatorUser } = require("../middleware/validator");
const fs = require("fs");
const { response } = require("../helper/response");

createFile("./data", "./data/dataUser.json");
let user = readNotes("./data/dataUser.json");

router.post("/register", validatorUser, (req, res) => {
  let data = user;
  const { username, password } = req.validated;

  try {
    data = {
      id: uuidv4(),
      username: username,
      password: password,
    };
    user.push(data);
    fs.writeFileSync("data/dataUser.json", JSON.stringify(user));
  } catch (error) {
    console.log(err);
    response(res, {
      code: 500,
      message: "Failed",
      data: error,
    });
    return;
  }
  response(res, {
    code: 200,
    message: "Success Register",
    data: data,
  });
});

//login

router.post("/login", validatorUser, (req, res) => {
  const { username, password } = req.validated;
  let users = user.find((item) => {
    return item.username == username;
  });

  try {
    if (users.password === password) {
      Jwt.sign({ datas: users }, "secretkeys", (err, token) => {
        res.json({
          code: 200,
          message: "Success Login",
          token,
        });
      });
    } else {
      res.status(400).json({
        code: 400,
        message: "psswrd slh gblg",
        // data: users,
      });
    }
  } catch (error) {
    response(res, {
      code: 500,
      message: "terjadi kesalahan",
      data: error,
    });
    return;
  }
  //   return;
  //   response(res, {
  //     code: 200,
  //     message: "Success Login",
  //     data: users,
  //   });
});
module.exports = router;
