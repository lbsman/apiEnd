const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const func = require('./postToInex.js');
const axios = require('axios');
const btoa = require('btoa');
const app = express();
const port = process.env.PORT || 3000;

var username = 'JoshWrenn';
var password = 'xq*QV2_z';
var basicAuth = 'Basic ' + btoa(username + ':' + password);

app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);

app.get('/',(req, res) => {
    res.render('test.html');
});

app.post('/Send', (req, res) => {

    var getBody = func.nexPost(req.body);
    console.log(Buffer.byteLength(getBody));

    var options = { 
        method: 'POST',
        url: 'https://api.inexusdialer.com/iNexusSoap/Service.asmx/ImportLeadBatch',
        qs: { tenantID: '237' },
        headers: 
        {
            'cache-control': 'no-cache',
            Connection: 'keep-alive', 'content-length': '344', 'accept-encoding': 'gzip, deflate',
            Host: 'api.inexusdialer.com', 'Cache-Control': 'no-cache',
            Accept: '*/*', 'Content-Length': Buffer.byteLength(getBody),
            Authorization: basicAuth, 'Content-Type': 'application/x-www-form-urlencoded' 
        },
        form: false,
        body: getBody
    };
    

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    });
    res.redirect('/thankYou.html');

});

app.get('/thankYou.html', (req, res) => {
    res.render('thankYou.html');
});

app.listen(port, () => {
    console.log('Started on port ' + port);
});













































// app.post('/Send', (req, res) => {
//     var url = 'https://api.inexusdialer.com/iNexusSoap/Service.asmx/ImportLeadBatch?tenantID=237';
//     var username = 'JoshWrenn';
//     var password = 'xq*QV2_z';
//     var basicAuth = 'Basic ' + btoa(username + ':' + password);
//     console.log(func.nexPost(req.body));
//     axios.post(url,{"body": func.nexPost(req.body)}, {headers:{'Authorization': + basicAuth}}).then((response) => {
//         //axios.post(url,{"body": func.nexPost(req.body), auth:{username: , password}"Authorization": "Basic " + new Buffer("JoshWrenn:xq*QV2_z").toString('base64')}).then((response) => {
//         console.log(response);
//     }).then((reponse) => {
//         res.redirect('/thankYou.html');
//     }).catch((error) => {
//         console.log(error);
//     });
// });