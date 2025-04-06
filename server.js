import dotenv from "dotenv";
import session from "express-session";
dotenv.config();
import express from "express";
import cors from "cors";
import url from "url";

import {prompt} from "./public/prompt.js"
import OpenAi from "openai"

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAi({
    apiKey

})


const PORT = 5000;
const serpapiKey = process.env.SERPAPI_KEY;


const app = express();
app.use(express.static("public"));
app.use(session({
    secret: process.env.SESSION_SECRET, // Use the secure key from your environment variable
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.get('/api', async (req, res) => {
    if (!req.session.chat) {
        req.session.chat = []; // Initialize chat for the session
    }
    const chat = req.session.chat;

    const urls = req.url.replace("/api", "");
    const params = new URLSearchParams({
        ...url.parse(urls, true).query  
    });
    
    const query = params.toString().replace("q=", "");
   
    try {
        let response = await aiCall(query, chat);
        const resArr = response.split("|");
        if (resArr.length > 1) {
            if (resArr[2].toUpperCase() !== "FALSE") {
                response += `item: /~${await getBestItem(resArr[2])}/~ `;
            }
        }
        res.send({ response });
    } catch {
        res.send({ res: "Error" });
    }
});
app.get("/del", (req, res) => {
    req.session.chat.pop();
    req.session.chat.pop();
    res.send({res: req.url})
});
app.get("/startOver", (req, res) => {
    req.session.chat = [];
    res.send({res: req.url})
});
async function getBestItem(title){
    let newTitle = title.replace("Possible match:", "");
   
    
    const shopRes = await fetch(`https://serpapi.com/search.json?engine=google_shopping&q=${newTitle}&api_key=${serpapiKey}`);
    const shopResJson = await shopRes.json();
    const shopArr = await shopResJson.shopping_results;
    
    let lowestPrice = 0;
    await shopArr.forEach(result => {
     if(!lowestPrice || result.extracted_price < lowestPrice){
        lowestPrice = result.extracted_price;
     }
    })
    const item = await shopArr.find(result => result.extracted_price === lowestPrice);
    
    return await JSON.stringify({best: shopArr[0], cheapest: item});
} 

async function aiCall(query, log) {
  
    log.push({role: "user", content: query});
    const response = await openai.responses.create({
        input: [{role: "developer", content: `This is the chatlog: ${JSON.stringify(log)}. ${prompt}. `},
                   {role: "user", content: query}
        ],
        model: "gpt-4o"
    })
    const assistantRes = await response.output_text;
    log.push({role: "assistant", content: assistantRes})
    return await assistantRes;
}
app.listen(PORT);
