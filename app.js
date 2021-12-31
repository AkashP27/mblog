const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const usersRoute = require("./routes/users");
const cors = require("cors");
// const path = require("path");

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose
 .connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
 })
 .then(console.log("connection successful"))
 .catch((err) => console.log(err));

app.use("/auth", authRoute);
app.use("/posts", postRoute);
app.use("/users", usersRoute);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
 res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

app.listen(process.env.PORT || 5000, () => {
 console.log("server is running");
});
