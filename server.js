const OpenTok = require("opentok");
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const opentok = new OpenTok(process.env.API_KEY, process.env.API_SECRET);
const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("common"));

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// TODO: this to be replaced with a database
let createdSessions = [];
const createSession = () =>
  new Promise((resolve, reject) => {
    opentok.createSession({ mediaMode: "routed" }, (err, session) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      // save the sessionId
      createdSessions.push(session.sessionId);
      resolve(session);
    });
  });

const generateToken = (session) => {
  return session.generateToken({
    role: "moderator",
    expireTime: new Date().getTime() / 1000 + 7 * 24 * 60 * 60, // in one week
    data: "name=Johnny",
    initialLayoutClassList: ["focus"],
  });
};

app.post("/api/token", async (req, res) => {
  const { sessionId } = req.body;
  const token = opentok.generateToken(sessionId);

  res.json({ token });
});

app.delete("/api/session/:roomId", (req, res) => {
  const rooms = createdSessions.filter(room => room !== req.params.roomId)
  createdSessions = [...rooms]
  res.send({rooms: rooms})
});

app.get("/api/session", (req, res) => {
  res.send({rooms: createdSessions});
});

app.post("/api/session", (req, res) => {
  createSession().then((newSession) => {
    const token = newSession.generateToken();
    res.send({ token, sessionId: newSession.sessionId, apiKey: process.env.API_KEY });
  });
});

// Starts the express app
app.listen(port, () => console.log(`Listening on port ${port}`));
