import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { env } from "node:process";

export function loggedIn(optional = false) {
  return function verifyLoggedIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    const exit = () => {
      if (!optional) {
        return res.redirect("/");
      } else {
        return next();
      }
    };
    const token = req.cookies?.auth;
    if (!token) exit();
    return jwt.verify(
      token,
      env["JWT_PRIVATE_KEY"]!,
      (err: any, decoded: any) => {
        if (err) {
          exit();
        } else {
          // Extend the cookies to include authenticated values.
          if (!req.cookies) req.cookies = {};
          req.cookies["discordToken"] = decoded.discordToken;
          req.cookies["username"] = decoded.username;
          next();
        }
      }
    );
  };
}
