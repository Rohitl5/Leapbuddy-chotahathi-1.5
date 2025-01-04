const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());


// app.post("/generate", async (req, res) => {
//   try {
//     console.log("Trying to send prompt and wait for response");
//     const { prompt } = req.body;

//     const response = await fetch("http://127.0.0.1:8000/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });

//     const responseText = await response.text(); // Log raw response
//     console.log("Raw Response from Python Backend:", responseText);

//     let data;
//     try {
//       data = JSON.parse(responseText); // Attempt to parse JSON
//     } catch (error) {
//       console.error("Failed to parse JSON from Python Backend:", error);
//       return res.status(500).json({ error: "Invalid JSON response from backend" });
//     }

//     if (!response.ok) {
//       return res.status(response.status).json({ error: data.error || "Backend Error" });
//     }

//     console.log("Parsed Response:", data.response);
//     res.json({ response: data.response });
//   } catch (error) {
//     console.error("Error in Node.js:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.post("/generate", async (req, res) => {
  try {
    console.log("Trying to send prompt and wait for response");
    const { prompt } = req.body;
    console.log(req.body); //printing the prompt

    const response = await fetch("http://127.0.0.1:8000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const responseText = await response.text(); // Log raw response
    console.log("Raw Response from Python Backend:", responseText);

    let data;
    try {
      data = JSON.parse(responseText); // Attempt to parse JSON
    } catch (error) {
      console.error("Failed to parse JSON from Python Backend:", error);
      return res.status(500).send('{"error": "Invalid JSON response from backend"}'); // Using res.send()
    }

    if (!response.ok) {
      return res.status(response.status).send(JSON.stringify({ error: data.error || "Backend Error" })); // Using res.send()
    }

    console.log("Parsed Response:", data.response);
    res.status(200).send(JSON.stringify({ response: data.response })); // Using res.send()
  } catch (error) {
    console.error("Error in Node.js:", error);
    res.status(500).send('{"error": "Internal Server Error"}'); // Using res.send()
  }
});



app.listen(3000, () => {
  console.log("Node.js server running on http://localhost:3000");
});
