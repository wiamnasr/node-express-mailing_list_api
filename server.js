const express = require("express");

const cors = require("cors");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



app.get("/*", (req, res) => {
  res.status(400).json({
    success: false,
    msg: "not within my api s reach...",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server listening...");
});
