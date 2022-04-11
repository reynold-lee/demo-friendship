import { Request, Response } from "express";

import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cors from "cors";
import path from "path";

require("dotenv").config();

// Load API
const users = require("./routes/api/users");

// App
const app = express();

// cors middleware
app.use(cors());

// body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport middleware
require("./config/passport")(passport);

app.use("/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
