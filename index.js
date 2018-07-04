'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app =express();

app.set('port',  (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

token = "EAADvzlgkPJ0BABe4P7YPg9IAOeN3GdZCi30NHr6dUkh8MKu4cGM0e0VYY5ZB4BfsisRoZBuzkcYshGWSOBXKaCo9AOEDPEgJvfhlU4jAzNt3CnpSn50uZAMuaRrBaUgL4gSdgRl5XVmzZAfZBgvuLTRHnp0aUDtElDubP9J2LA5vKeD4ixs6Mw"

app.get('/', function(req, res){
    res.send("Hi I am a chatBot");
});

app.get('/webhook/', function(req, res){
    if(req.query['hub.verify_token'] === "udaybhola"){
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong Token");
});

app.post('/webhook/', function(req,res){
    let messaging_events = req.body.entry[0].messaging_events;
    for(let i = 0; i < messaging_events.length; i++ ){
        let event = messaging_events[i]
        let sender = event.sender.id
        if(event.message && event.message.text){
            let text= event.message.text
            sendText(sender, "Text echo:" + text.substring(0, 100))
        }
    }
    res.sendStatus(200);
})

function sendText(sender, text){
    let messageData = {
        text:text
    }
    request({
        url:"https://graph.facebook.com/v2.6/me/messages",
        qs : {accsess_token, token},
        method: "POST",
        json: {
            receipient: {id:sender},
            message : messageData
        }
    }, function(error, response, body){
        if(error) {
            console.log("sending error")
        }else if(response.body.error){
            console.log("response body error")
        }
    })
}
app.listen(app.get('port'), function(){
    console.log("running !!");
});