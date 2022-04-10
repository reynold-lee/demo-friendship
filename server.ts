import { Request, Response } from "express";

const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

require("dotenv").config();

// App
const app = express();

// TODO : Add passport middleware
