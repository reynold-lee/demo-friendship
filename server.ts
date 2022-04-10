import { Request, Response } from "express";

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

require("dotenv").config();

// DB config
const db = require("./config/keys").mongoURI;

// App
const app = express();

// TODO : Add passport middleware

// Connecting to mongoose
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.log(err));

app.get("/", (req: Request, res: Response) => res.send("Hello David!"));

// PORT
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
