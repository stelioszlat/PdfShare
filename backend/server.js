const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const metaRoutes = require('./routes/meta-routes');
const HttpError = require('./models/http-error');

const path = require('path');

const app = express();

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/', (req, res, next)=>{
    // res.status(200).json('Main page')
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use('/api/metadata', metaRoutes);

// app.get('/files', (req, res, next)=>{       // query a
    
// });

// mongoose.connect(
//     "mongodb+srv://stelioszlat:ntERINguANdweSc@pdfcluster.0iyo1.mongodb.net/?retryWrites=true&w=majority",
//     {useNewUrlParser: true,
//     useUnifiedTopology: true}
// ).then(()=>{
//     app.listen(5000);
// }).catch(()=>{
//     new HttpError('Connection failed', 500);
// });

app.listen(8080);
