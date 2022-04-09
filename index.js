const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.listen(port);

app.send("/",(req,res)=>{
    res.send("Hello Woeld");
})
console.log(`App listen in the port ${port}`);
