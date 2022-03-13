// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")
const crypto = require('crypto')

const app = express()
const PORT = 3000// Tell express to use body-parser's JSON parsing

app.use(bodyParser.json())
app.use(function (req, res, next) {
  console.log("Authentication x-oc-hash: ", req.headers["x-oc-hash"])

  let hmac = req.headers['x-oc-hash']

  var msg = JSON.stringify(req.body)
  var sharedSecret = 'my-real-secret'
  //generate hmac sha256 hash
  let hmacSignature = crypto.createHmac('sha256', sharedSecret).update(msg).digest("base64");
  console.log(hmac, hmacSignature)
  if (hmac != hmacSignature)
    res.status(403).end()
  else
    next()
})

app.post("/ping", (req, res) => {
  console.log("Ping -----------\n", JSON.stringify(req.body))
  console.log(JSON.stringify(req.headers))

  res.status(200).end()
})

app.post("/confirmorder", (req, res) => {
  console.log("Confirm Order -----------\n", req.body) // Call your action on the request here
  const responseData = {
    proceed: false,
    body: {
      customMessage: "you cannot proceed, the ping will not invoked",
      suggestions: "change the nodejs response to true"
    }
  }

  const jsonContent = JSON.stringify(responseData);
  res.end(jsonContent);
  res.status(200).end() // Responding is important
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))