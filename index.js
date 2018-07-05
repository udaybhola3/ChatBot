'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app =express();

app.set('port',  (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

 let token = "EAADvzlgkPJ0BAPg5hXbq2r1fCyqf7SZA0rfhZAPFmhhMTfTnOnufcOAFpmNTBXfbtBBag9WKnchzZBvvmw9u8NCjJBxOUmURxT7GxHpO2694xVCEUUfGWETSw0spzboYJKqmfWm5PTTOC1NqnA8H8fd3UZC8YX54x0GcSr4UX9L01hxZCAEZCj"

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
    let messaging_events = req.body.entry[0].messaging;
    for(let i = 0; i < messaging_events.length; i++ ){
        let event = messaging_events[i]
        let sender = event.sender.id
        if(event.message && event.message.text){
            let text= event.message.text
            // sendText(sender, "Text echo:" + text.substring(0, 100))
            decideMessage(sender, text);
        }
        if(event.postback){
            let text = JSON.stringify(event.postback);
            decideMessage(sender, text)
            continue
        }
    }
    res.sendStatus(200);
})

function decideMessage(sender, text1){
    let text = text1.toLowerCase();
    if(text.includes("summer")){
        sendImageMessage(sender);
         console.log("summer inside decide message function");
    }
    else if(text.includes("winter")){
        sendGenericMessage(sender);
        console.log("winter inside decide message function");
    }
    else{
     sendText(sender, "I Like Fall");
        sendButtonMesssage(sender, "What is your Favourite season?");
    }
}

function sendText(sender, text){
    let messageData = {
        text: text
    }
   sendRequest(sender, messageData)
}

function sendButtonMesssage(sender, text){
    let messageData = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":text,
              "buttons":[
                {
                  "type":"postback",
                  "title":"Summer",
                  "payload":"summer"
                },
                {
                  "type":"postback",
                    "title":"Winter",
                    "payload":"winter"
                },
                {
                    "type":"postback",
                    "title":"Rainy",
                    "payload":"rainy"
                }
              ]
            }
          }
    }
    sendRequest(sender, messageData);
}

function sendImageMessage(sender){
    let messageData = {
        attachment:{
            type:"image", 
            payload:{   
              url:"http://www.messenger-rocks.com/image.jpg"
            //   is_reusable:true
            }
          }
        }
          
    sendRequest(sender, messageData);
}

function sendGenericMessage(sender){
    let messageData = {
         "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":"Winter!",
              "image_url":"https://www.google.co.in/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjj34fIooXcAhVMv48KHb6PAwEQjRx6BAgBEAU&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fwinter%2F&psig=AOvVaw0VnZutizdIdsdPcwZNY5fo&ust=1530787661428618",
              "subtitle":"I LOve Winter",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://en.wikipedia.org/wiki/Winter",
                  "title":"More About Winter"
                }               
              ]      
            }
          ]
        }
     }
}
sendRequest(sender, messageData);
}

function sendRequest(sender, messageData){
    request({
        url:"https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token: token},
        method: "POST",
        json: {
            recipient: {id:sender},
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