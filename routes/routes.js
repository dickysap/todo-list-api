const express = require("express");
const router = express.Router();
const fs = require("fs");
const { validatorTodoList } = require("../middleware/validator");
const { response } = require("../helper/response");
const { v4: uuidv4 } = require("uuid");
const { midBearerToken, verifyToken } = require("../middleware/auth");
const { createFile, readNotes } = require("../pkg/filesystem");
const Jwt = require("jsonwebtoken");

createFile("./data", "./data/notes.json");

let notes = readNotes("data/notes.json");

// get all data
router.get("/", verifyToken, (req, res) => {
  Jwt.verify(req.token, "secretkeys", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.status(200).json({ success: true, authData, data: notes });
    }
  });
});

// get data berdasarkan id
router.get("/:id", (req, res) => {
  let foundData = notes.find((item) => {
    return item.id === parseInt(req.params.id);
  });

  if (foundData) {
    res.status(200).json({
      success: true,
      data: foundData,
    });
  } else {
    res.sendStatus(404);
  }
});

//mengirim data ke file json
router.post("/", validatorTodoList, (req, res, next) => {
  let data = notes;
  const { title, bodyNotes } = req.validated;
  try {
    data = {
      id: uuidv4(),
      title: title,
      bodyNotes: bodyNotes,
    };
    notes.push(data);
    fs.writeFileSync("data/notes.json", JSON.stringify(notes));
  } catch (err) {
    console.log(err);
    response(res, {
      code: 500,
      data: err,
      message: "Data Error",
    });
    return;
  }
  response(res, {
    code: 200,
    data: data,
    message: "Success Add Data",
  });
});

//delete array object in notes.json
router.delete("/:id", (req, res) => {
  let foundId = notes.find((item) => {
    return item.id == parseInt(req.params.id);
  });

  if (foundId) {
    res.status(200).json({
      success: true,
      message: "Success Delete Data",
    });
    let targetId = notes.indexOf(foundId);
    notes.splice(targetId, 1);
    fs.writeFileSync("data/notes.json", JSON.stringify(notes));
  }
  res.status(204).json({
    success: false,
    message: "Failed Delete Data",
  });
});

//update data
router.put("/:id", validatorTodoList, (req, res) => {
  let getId = notes.find((item) => {
    return item.id == req.params.id;
  });
  let index = notes.indexOf(getId);
  const { title, bodyNotes } = req.validated;
  let data = notes;
  try {
    if (getId) {
      data = {
        id: parseInt(req.params.id),
        title: title,
        bodyNotes: bodyNotes,
      };
    }
    notes.splice(index, 1, data);
    fs.writeFileSync("data/notes.json", JSON.stringify(notes));
  } catch (error) {
    console.log(error);
    response(res, {
      code: 500,
      data: error,
      message: "terjadi kesalahan",
    });
    return;
  }
  response(res, {
    code: 200,
    data: data,
    message: "Success update data",
  });
});
module.exports = router;
