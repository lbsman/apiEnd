const express = require('express');
var bodyParser = require('body-parser');
const func = require('./postToInex.js');
const axios = require('axios');
var app = express();
const port = process.env.PORT || 3000;

app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);

app.get('/',(req, res) => {
    res.render('test.html');
});

app.post('/Send', (req, res) => {
    var url = 'https://api.inexusdialer.com/iNexusSoap/Service.asmx/ImportLeadBatch?tenantID=237';
    axios.post(url,{"body": func.nexPost(req.body), "Authorization": "Basic " + new Buffer("JoshWrenn:xq*QV2_z").toString('base64')}).then((response) => {
        console.log(response);
    }).then((reponse) => {
        res.redirect('/thankYou.html');
    }).catch((error) => {
        console.log(error);
    });
});

app.get('/thankYou.html', (req, res) => {
    res.render('thankYou.html');
});

app.listen(port, () => {
    console.log('Started on port ' + port);
});