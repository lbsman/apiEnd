const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const mustache = require('mustache');
const func = require('./postToInex.js');
const btoa = require('btoa');
const parseString = require('xml2js').parseString;
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

var username = 'JoshWrenn';
var password = 'xq*QV2_z';
var basicAuth = 'Basic ' + btoa(username + ':' + password);

app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);

app.get('/',(req, res) => {
    res.render('formFill.html');
});
app.get('/createCampaign',(req, res) => {
    res.render('createCampaign.html');
});

app.post('/Send', (req, res) => {

    var getBody = func.nexPost(req.body);
    var buffSize = Buffer.byteLength(getBody);

    var options = { 
        method: 'POST',
        url: 'https://api.inexusdialer.com/iNexusSoap/Service.asmx/ImportLeadBatch',
        qs: { tenantID: '237' },
        headers: 
        {
            'cache-control': 'no-cache',
            Connection: 'keep-alive', 'content-length': buffSize,
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
    res.redirect('/thankYou');

});

app.get('/getInfo', (req, res) => {
    var getBody = func.nexPost(req.body);

    var options = { 
        method: 'GET',
        url: 'https://api.inexusdialer.com/iNexusSoap/Service.asmx/GetAllCampaigns',
        qs: { tenantID: '237' },
        headers: 
        {
            'cach-control': 'no-cache',
            Connection: 'keep-alive',
            Host: 'api.inexusdialer.com', 'Cache-Control': 'no-cache',
            'Content-Type': 'application/xml',
            Accept: '*/*', 
            Authorization: basicAuth 
        }
    };
    
    var bodyResp = "";
    var displayJson = [];

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        parseString(body, function(err,result){
            var onCamps = [];
            var offCamps = [];
            bodyResp = result.string._.split("Row");
            bodyResp.splice(0,1);
            for(var i = 0; i < bodyResp.length; i++){
                bodyResp[i] = bodyResp[i].trim();
                // bodyResp[i] = bodyResp[i].replace(" /><","").replace("/Campaigns>","");
                var campaignId = nexPost(bodyResp[i].substring(bodyResp[i].indexOf("CampaignID"), bodyResp[i].indexOf('CampaignName')-1).replace('"',''));
                var campaignName = nexPost(bodyResp[i].substring(bodyResp[i].indexOf("CampaignName"), bodyResp[i].indexOf('Type')-1).replace('"',''));
                var campType = nexPost(bodyResp[i].substring(bodyResp[i].indexOf("Type"), bodyResp[i].indexOf('DialingRule')-1).replace('"',''));
                var dialingRule = nexPost(bodyResp[i].substring(bodyResp[i].indexOf("DialingRule"), bodyResp[i].indexOf('Status')-1).replace('"',''));
                var status = nexPost(bodyResp[i].substring(bodyResp[i].indexOf("Status"), bodyResp[i].indexOf('Ratio')-1).replace('"',''));
                var ratio = nexPost(bodyResp[i].substring(bodyResp[i].indexOf("Ratio"), bodyResp[i].indexOf('CampaignGroup')-1).replace('"',''));
                var campaignGroup = nexPost(bodyResp[i].substring(bodyResp[i].indexOf("CampaignGroup"), bodyResp[i].indexOf('/><')-1).replace('"',''));
                
                var newThing = {name: campaignName, cId: campaignId, cType: campType, dialRul: dialingRule, stat: status, rat: ratio, cGroup: campaignGroup, editInfo: campaignId};
                //Will determine were to put the info 
                if(status === 'OFF'){
                    offCamps.push(newThing);
                }else{
                    onCamps.push(newThing);
                }
            }
            var page = fs.readFileSync('views/campaignInfo.html', 'utf8');
            var rData = {offStuff: offCamps, onStuff: onCamps};
            var html = mustache.to_html(page, rData);
            res.send(html);
        });
    });
});

app.get('/campaignInfo', (req, res)=> {
    // console.log(req);
    var newThing = {name: req.query.cName, cid: req.query.cid, cType: req.query.ctype, dialRul: req.query.drule, stat: req.query.stat, rat: req.query.rat, cGroup: req.query.cgro};
    var dData = [];
    dData.push(newThing);
    var page = fs.readFileSync('views/singleCampaign.html', 'utf8');
    var rData = {cData: dData};
    var html = mustache.to_html(page, rData);
    res.send(html);
    // res.render('singleCampaign.html');
});

app.get('/thankYou', (req, res) => {
    res.render('thankYou.html');
});

app.get('/testThing', (req, res) => {
    var demoData = {"name": "Josh Wrenn"};
    var page = fs.readFileSync('views/testThing.html', "utf8");
    var html = mustache.to_html(page, demoData);
    
    res.send(html);
});

var nexPost = (data) => {
    return data.substring(data.indexOf("=")+1,data.indexOf('"'));
};

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