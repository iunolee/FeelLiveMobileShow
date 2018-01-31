'use strict'
require('colors')

const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const Twit = require('twit')
const fs = require('fs');
const T = new Twit({
  consumer_key: "NhwD43E2ngusHKj89BMHSiOV5",
  consumer_secret: "9olMD5Xyux6eto3P4WYEs6kE1YbU3MbMk6qkg5Ik0aM4RPbEpb",
  access_token: "834188886322642944-YulS5GSr0GvswA5bvcAA5SGMMzZKjYK",
  access_token_secret: "KjuwO1cO3reD3FZAp25mYUflBDcjo17xY01WLUwiHRFlZ",
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
});

// http protocol
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use("/public", express.static(__dirname + '/public'));

http.listen(9999, function() {
  console.log('listening on *:9999');
});


//emotion list
const joy = ["excited", "sensuous", "energetic", "cheerful", "creative"];
const trust = ["aware", "proud", "respected", "appreciated", "important", "faithful", "nurturing", "trusting", "loving", "intimate", "thoughtful", "content"];
const fear = ["confused", "rejected", "helpless", "submissive", "insecure", "anxious"];
const surprise = ["amazed", "astonished", "distracted"];
const sadness = ["tired", "lonely", "depressed", "ashamed", "guilty", "gloomy"];
const disgust = ["bored", "disliked", "loathsome"];
const anger = ["hurt", "hostile", "angry", "selfish", "hateful", "critical"];
const anticipation = ["curious", "interested", "expectant"];


// const config = require('./config.json')
const datas = {
  stringData: 'foo',
  intData: 0,
  // floatData: 0.5,
  // boolData: true,
  // nested: {
  //   hello: 'world'
  // }
}

// io = require('socket.io')(config.server.port)


const io = require('socket.io')(http);

io.on('connection', function(socket) {
  console.log('connected'.bold.green)
  console.log("We have a new client: " + socket.id);
  // console.log('query:', socket.handshake.query)


  //mobile part
  socket.on('button', function(data) {
    // Data comes in as whatever was sent, including objects
    console.log("Received: button number: " + data.buttonNum + " // keyword : " + data.emotionKeyword);

    let selectedKeyword = data.emotionKeyword;

    let sendData = {
      intData: parseInt(data.buttonNum)
    };

    // send button number to openframeworks
    io.emit('server-event', sendData)

    // start searching tweets
    searchTweet(selectedKeyword);

    // send tweets string to openframeworks
    setTimeout(function() {
      let finalTweets = searchResult.join(';');
      // console.log(finalTweets);
      let sendTweetData = {
        stringData: finalTweets
      };
      console.log(sendTweetData);
      io.emit('server-event-2', sendTweetData);
    }, 1000);

      // setTimeout(function() {
        searchResult = [];
      // }, 1100);
  });


  socket.on('disconnect', () => {
    console.log('disconnect'.bold.red)
    // clearInterval(emitInterval)
  })
});


let searchResult = [];

function searchTweet(keyword) {
  T.get('search/tweets', {
    q: keyword + " since:2017-12-11",
    count: 100,
    language: 'en'
    // reslut_type: recent,
    // lang: kr
  }, function(err, data, response) {
    var statuses = data.statuses;
    for (var j = 0; j < statuses.length; j++) {
      var thisText = statuses[j].text;
      // thisText = thisText.split('@')[0];
      // thisText = thisText.split('rt')[0];
      thisText = thisText.split('http')[0];
      thisText = thisText.split("'")[0];
      thisText = thisText.split('"')[0];
      thisText = thisText.split(/\n/)[0];
      thisText = thisText.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)[0];
      thisText = thisText.toString();
      // if (thisText.endsWith(".")) {
      // thisText = thisText.slice(0, -1);
      // }
      if (thisText !== "") {
        if (thisText.indexOf(keyword) !== -1) {
          if (searchResult.indexOf(thisText) == -1) {
            searchResult.push(thisText);
          }
        }
      }
    }
    // var key = emotionList[i];
    // finalData[key] = searchResult;
  })
  // searchResult = [];
}

// const nsp = io.of('/nsp')
// nsp.on('connection', function(socket) {
//   console.log('connection from namespace /nsp'.bold.green)
//   let emitInterval = setInterval(() => {
//     socket.emit('nsping')
//   }, 2000)
//
//   socket
//     .on('disconnect', () => {
//       console.log('disconnect from namespace /nsp'.bold.red)
//       clearInterval(emitInterval)
//     })
//     .on('nspong', (data) => {
//       console.log('nspong'.blue)
//     })
// })
