import express, { Router } from "express";
import { Home } from "./views/home/home";
import render from "preact-render-to-string";

const webRouter = Router();

webRouter.use("/static", express.static("./serverDist/static"));

webRouter.get("/", (_req, res) => {
  return res.send(render(Home({ username: "chillydudas" })));
});

export { webRouter };
