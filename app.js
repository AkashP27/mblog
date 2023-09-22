const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postsRoute");
const usersRoute = require("./routes/usersRoute");
const OAuthRoute = require("./routes/OAuthRoute");

const app = express();

// Set security HTTP headers
app.use(helmet());

app.use(express.json());
app.use(cors());
dotenv.config({ path: "./env" });

// Data sanitization against NoSQL query injection - for email  {"$gt" :""}
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

mongoose
	.connect(process.env.MONGO_DOCKER, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: true,
	})
	.then(console.log("connection successful"))
	.catch((err) => console.log(err));

app.use("/auth", authRoute);
app.use("/posts", postRoute);
app.use("/user", usersRoute);
app.use("/oauth", OAuthRoute);

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
	console.log(`server is  on ${port}`);
});
