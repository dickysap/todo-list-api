const express = require("express");
const router = express.Router();
const fs = require("fs");

// let data = [{ id: 1, title: "Anak Haram", bodyNotes: "Aku adalah anak haram" }];

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
router.post("/", (req, res, next) => {
  let itemsId = notes.map((item) => item.id);
  let newid = itemsId.length + 1;
  let newNotes = {
    id: newid,
    title: req.body.title,
    bodyNotes: req.body.bodyNotes,
  };

  notes.push(newNotes);
  fs.writeFileSync("data/notes.json", JSON.stringify(notes));
  res.status(201).json({
    success: true,
    message: "Berhasil Insert Data",
    data: newNotes,
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
router.put("/:id", (req, res) => {
  let getId = notes.find((item) => {
    return item.id == req.params.id;
  });

  if (getId) {
    let updated = {
      id: parseInt(req.params.id),
      title: req.body.title,
      noteBody: req.body.bodyNotes,
    };
    let idxTarget = notes.indexOf(getId);
    notes.splice(idxTarget, 1, updated);
    fs.writeFileSync("data/notes.json", JSON.stringify(notes));
    res.status(200).json({
      message: "Success Updated Data",
      data: updated,
    });
  } else {
    res.sendStatus(404);
  }
});
module.exports = router;
