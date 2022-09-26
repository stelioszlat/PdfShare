const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join("frontend", "build")));

app.get('', (req, res, next) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.use((err, req, res, next) => {
    res.send("<h3>Page not found!</h3>");
});

app.listen(8070, "localhost", () => {
    console.log("Web service started at localhost:8070");
});