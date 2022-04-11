import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cors from "cors";

require("dotenv").config();

// Load API
import auth from "./routes/api/auth";
import users from "./routes/api/users";
import friends from "./routes/api/friends";

// App
const app = express();

// cors middleware
app.use(cors());

// body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport middleware
require("./config/passport")(passport);

app.use("/", auth);
app.use("/users", passport.authenticate("jwt", { session: false }), users);
app.use("/friends", passport.authenticate("jwt", { session: false }), friends);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
