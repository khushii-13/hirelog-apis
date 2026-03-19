const express = require("express");

const app = express();

app.get("/",(req, res)=>{
    const h1 = "<h1>Hello everyone</h1>";
    res.send(h1);
})

app.listen(8000, ()=>{
    console.log(`Server is listening on http://localhost:8000`);
})