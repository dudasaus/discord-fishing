import "dotenv/config";
import express, { Router } from "express";
import { Home } from "./views/home/home";
import render from "preact-render-to-string";
import { env } from "node:process";
import request from "request";
import jwt from "jsonwebtoken";
import { loggedIn } from "./verify";
import cookieParser from "cookie-parser";

const webRouter = Router();

webRouter.use(cookieParser());
webRouter.use("/static", express.static("./serverDist/static"));

webRouter.get("/", loggedIn(true), (req, res) => {
  const username = req.cookies?.username;
  return res.send(render(Home({ username })));
});

// Discord authorization
// TODO: Remove env references for secret references.
webRouter.get("/authorize", (req, res) => {
  const { code } = req.query;

  const form = {
    client_id: env["DISCORD_APP_ID"],
    client_secret: env["DISCORD_CLIENT_SECRET"],
    grant_type: "authorization_code",
    code,
    redirect_uri: "http://localhost:3000/authorize",
  };

  request.post(
    "https://discord.com/api/oauth2/token",
    {
      form,
    },
    async (err, _response, body) => {
      if (!err) {
        const bodyObj = JSON.parse(body);
        const discordToken = bodyObj.access_token;
        const user = await getDiscordUser(discordToken);
        const authPayload = { discordToken, username: user.username };
        res.cookie("auth", jwt.sign(authPayload, env["JWT_PRIVATE_KEY"]!), {
          maxAge: 1000 * 60 * 60, // 1 hr
        });
        res.redirect("/");
      } else {
        res.status(403).send("Unable to login");
      }
    }
  );
});

async function getDiscordUser(token: string): Promise<{ username: string }> {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: "https://discord.com/api/users/@me",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      (error, _response, body) => {
        if (error) {
          reject(error);
        } else {
          const bodyObj = JSON.parse(body);
          resolve(bodyObj);
        }
      }
    );
  });
}

export { webRouter };
