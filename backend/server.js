const express = require('express');
const bodyParser = require('body-parser');

const metaRoutes = require('./routes/meta-routes');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/metadata', metaRoutes);

app.get('/files', (req, res, next)=>{
    
});



app.listen(5000);