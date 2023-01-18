const express = require("express");
const router = express.Router();
const fs = require("fs");
const { validatorTodoList } = require("../middleware/validator");
const { response } = require("../helper/response");
const DATA_DIR = "./data";

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const DATA_JSON = "./data/notes.json";
if (!fs.existsSync(DATA_JSON)) {
  fs.writeFileSync(DATA_JSON, "[]", "utf-8");
}

const fileBuffer = fs.readFileSync("data/notes.json", "utf-8");
const notes = JSON.parse(fileBuffer);

// get all data
router.get("/", (req, res) => {
  res.status(200).json({ success: true, data: notes });
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
  let itemsId = notes.map((item) => item.id);
  let newid = itemsId.length + 1;

  let data = notes;
  const { title, bodyNotes } = req.validated;
  try {
    data = {
      id: newid,
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
