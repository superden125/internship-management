import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";

import { url, options } from "./app/config/mongodb";

import indexRouter from "./app/routes/index";
import studentRouter from "./app/routes/student";
import teacherRouter from "./app/routes/teacher";
import adminRouter from "./app/routes/admin";

const PORT = process.env.PORT || "3000";

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "DC4483AB18723",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/admin", adminRouter);

mongoose.connect(url, options, (err) => {
  if (err) return console.log(err);
  console.log("Connected to db...");
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
});
