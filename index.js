import express from "express";

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/test", (_, res) => {
  res
    .json({
      message: "Ok",
    })
    .send();
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
