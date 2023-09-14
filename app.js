const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postsRoute");
const usersRoute = require("./routes/usersRoute");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

mongoose
	.connect(process.env.MONGO_LOCAL, {
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

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
	console.log(`server is running on ${port}`);
});
