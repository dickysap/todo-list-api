const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const itemRoutes = require("./routes/routes");
const loginRoutes = require("./routes/login_route");

app.use(express.json());
app.use(cors());
app.use("/notes", itemRoutes);
app.use("/auth", loginRoutes);

app.use("/", (req, res) => {
  res.send("Notes Apps");
});

app.listen(port, () => {
  console.log(`App Sedang Berjalan pada port ${port}`);
});
