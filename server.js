const express = require("express");

const cors = require("cors");

// data
const lists = require("./lists");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.put("/lists/:name", (req, res) => {
  const userListName = req.params.name;

  const { name, members } = req.body;
  if (name == userListName) {
    const listArray = Array.from(lists);
    const nameFound = listArray.filter(
      (listName) => listName[0].toLowerCase() === userListName
    );

    if (nameFound.length > 0) {
      nameFound[0][1] = members || nameFound[0][1];
      return res.status(200).json({
        success: true,
        updatedName: nameFound,
      });
    } else if (nameFound.length === 0 && (name || members)) {
      const newList = new Map();
      newList.set(userListName, members);
      const merged = new Map([...lists, ...newList]);
      return res.status(201).json({
        success: true,
        newList: Array.from(merged),
      });
    }
  }

  return res.status(404).json({
    success: false,
    msg: "something went wrong...",
    hints: {
      1: "format: /lists/:name",
      2: "name provided in url must match the one used in the request body",
    },
  });
});

app.delete("/lists/:name", (req, res) => {
  const { name } = req.params;

  const nameFound = Array.from(lists).filter(
    (listName) => listName[0].toLowerCase() === name
  );

  if (nameFound.length > 0) {
    const remainingNames = Array.from(lists).filter(
      (listName) => listName[0].toLowerCase() !== name
    );

    if (remainingNames.length > 0) {
      return res.status(200).json({
        success: true,
        deleted: name,
        remaining: remainingNames,
      });
    }

    return res.status(200).json({
      success: true,
      deleted: name,
      msg: "No more names remaining...",
    });
  }

  return res.status(404).json({
    success: false,
    msg: "Name not found...",
  });
});

app.get("/lists/:name", (req, res) => {
  const { name } = req.params;

  if (name) {
    const matchingName = Array.from(lists).filter(
      (listName) => listName[0].toLowerCase() === name
    );

    if (matchingName.length > 0) {
      return res.status(200).json({
        success: true,
        name: matchingName[0][0],
        members: matchingName[0][1],
      });
    }

    return res.status(404).json({
      success: false,
      msg: "Name not found...",
    });
  }
});

app.get("/lists", (req, res) => {
  const keys = [];
  for (const key of lists.keys()) {
    keys.push(key);
  }

  if (keys.length > 0) {
    return res.status(200).json({
      success: true,
      listNames: keys,
    });
  }

  return res.status(200).json({
    success: false,
    msg: "no names found...",
    keys,
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    msg: "welcome to Wiam s mailing list api server",
    methods: {
      "/lists": "fetches all the existing list names",
      "/lists/:name": "fetches matching name emails list",
    },
  });
});

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
