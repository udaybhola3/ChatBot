'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');

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
    else if(text.includes("rainy")){
        sendRainyImageMessage(sender);
        console.log("rainy season, inside decide message function");
    }else if(text.includes("list")){
        sendListMessage(sender);
        console.log("List message, inside decide message function");
    }else if(text.includes("why")){
        sendViewMoreMessage(sender);
        console.log("why, inside decide message function");
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
        "attachment":{
            "type":"image", 
            "payload":{
              "is_reusable": true,
              "url":"https://thehungryjpeg.com/img/products/2cce1c7dbdcaa2b915ecd635860ff36af17cf1a1.jpg"
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
              "image_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHSscJXy_74IUCmlNMvnpZmVO-uPderX8jbaQ_Glylqtfxm5OD",
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

function sendRainyImageMessage(sender){
    let messageData = {
        "attachment":{
            "type":"image", 
            "payload":{
              
              "url":"https://www.gambar.co.id/wp-content/uploads/2018/04/wallpaper-3-dimensi-android-rain-wallpaper-hd-c2b7ac291-download-free-awesome-full-hd-wallpapers-for-of-wallpaper-3-dimensi-android.png"
            }
          }
        }
    sendRequest(sender, messageData);
}

function sendListMessage(sender){
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
              "template_type": "list",
              "top_element_style": "compact",
              "elements": [
                {
                  "title": "Classic T-Shirt Collection",
                  "subtitle": "See all our colors",
                  "image_url": "https://5.imimg.com/data5/IW/BW/MY-8481883/white-t-shirt-500x500.jpg",          
                  "buttons": [
                    {
                      "title": "View",
                      "type": "web_url",
                      "url": "https://www.amazon.in/dp/B07BVMTB8F?aaxitk=Q4DcVomqOw7p0dGfrClL1A&pd_rd_i=B07BVMTB8F&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=2922795243013535066&pf_rd_s=desktop-sx-top-slot&pf_rd_t=301&pf_rd_i=t-shirt&hsa_cr_id=8673287690502",
                     }
                  ]
                },
                {
                  "title": "Classic White T-Shirt",
                  "subtitle": "See all our colors",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.amazon.in/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=t+shirt",
                    
                  }
                },
                {
                  "title": "Classic Blue T-Shirt",
                  "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyNhi0bN8_bVbjMVmVb5W0qcu7lWhheyvQ0HRYuZbhRkZgQJfN8w",
                  "subtitle": "100% Cotton, 200% Comfortable",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.amazon.in/dp/B07BVXQ284?aaxitk=byFgdcenBlU3RLpRhgVfSw&pd_rd_i=B07BVXQ284&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=2922795243013535066&pf_rd_s=desktop-sx-top-slot&pf_rd_t=301&pf_rd_i=t-shirt&hsa_cr_id=8673287690502",
                    // "messenger_extensions": true,
                    // "webview_height_ratio": "tall",
                    // "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                 },
                  "buttons": [
                    {
                      "title": "Shop Now",
                      "type": "web_url",
                      "url": "https://www.amazon.in/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=t+shirt",
                 }
                  ]        
                }
              ],
               "buttons": [
                {
                  "title": "Why",
                  "type": "postback",
                  "payload":"why"
                 }
              ]  
            }
          }
        }
        sendRequest(sender, messageData);
    }

function sendViewMoreMessage (sender){
    var body;
    var buttons= [
        {
          "type":"element_share",
            "share_contents": { 
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [
                  {
                    "title": "welcome",
                    "buttons": [
                      {
                        "type": "web_url",
                        "url": "https://m.me/asksusiai", 
                        "title": "Chat with SUSI AI"
                      }
                    ]
                  }
                ]
              }
            }
          }
        } 
    ];

    fetch('http://api.susi.ai/susi/chat.json?q=why')
    .then(res => res.json())
    .then(json => {
        body=json;
        var arr = [];
        // console.log(body.answers[0].metadata)
        var metaCnt = body.answers[0].metadata.count;
        console.log("//////////////////////", metaCnt);
        for(var i=0; i<10;i++){
            arr.push(
                {
                    "title": body.answers[0].data[i].text || "hello user",
                    "subtitle": body.answers[0].data[i].skill_link || "welcome"
                  
                }
            );
            console.log("array----", arr);
    }
        let messageData =  {
            "attachment": {
            "type": "template",
            "payload": 
            {
                "template_type": "generic",
                "elements": arr,
            }
        }
        }
        sendRequest(sender, messageData);
    });
   
}    
function sendRequest(sender, messageData){
    request({
        url:"https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token: token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message : messageData
        }
    }, function(error, response, body){
        console.log('#### :: ', response)
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