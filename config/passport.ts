import { PrismaClient } from "@prisma/client";
import { PassportStatic } from "passport";
import { VerifiedCallback } from "passport-jwt";

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const prisma = new PrismaClient();

const keys = require("./keys");

const opts: {
  jwtFromRequest?: string;
  secretOrKey?: string;
} = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(opts, (payload: any, done: VerifiedCallback) => {
      const user = prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
};
