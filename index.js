const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const apiKey = process.env.CLIENT_ID;
const apiSecret = process.env.CLIENT_SECRET;

const app = express();

app.get("/", (req, res) => {
  res.send("visit /login to login with Blizzard oauth");
});

app.get("/login", (req, res) => {

  return new Promise((resolve, reject) => {
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`);

    const requestOptions = {
      host: `${region}.battle.net`,
      path: "/oauth/token",
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials.toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    let responseData = "";

    function requestHandler(res) {
      res.on("data", (chunk) => {
        responseData += chunk;
      });
      res.on("end", () => {
        const data = JSON.parse(responseData);
        console.log("response data", responseData);
        resolve(data);
      });
    }

    const request = require("https").request(requestOptions, requestHandler);
    request.write("grant_type=client_credentials");
    request.end();

    request.on("error", (error) => {
      reject(error);
    });
  });

});



app.use((err, req, res, next) => {
  res.end(err.toString());
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
