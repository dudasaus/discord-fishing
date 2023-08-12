import { Router } from "express";
import { Home } from "./home";
import render from "preact-render-to-string";

const webRouter = Router();

webRouter.get("/", (_req, res) => {
  return res.send(render(Home({ username: "chillydudas" })));
});

export { webRouter };
