// socket connection
const socket = io.connect();
socket.on('connect', function() {
  console.log("Connected");
});

let tweetText;

socket.on('server-event-2', function(data) {
  tweetText = data.stringData;
});


// emotion list
const joy = ["excited", "sensuous", "energetic", "cheerful", "creative"];
const trust = ["aware", "proud", "respected", "appreciated", "important", "faithful", "nurturing", "trusting", "loving", "intimate", "thoughtful", "content"];
const fear = ["confused", "rejected", "helpless", "submissive", "insecure", "anxious"];
const surprise = ["amazed", "astonished", "distracted"];
const sadness = ["tired", "lonely", "depressed", "ashamed", "guilty", "gloomy"];
const disgust = ["bored", "disliked", "loathsome"];
const anger = ["hurt", "hostile", "angry", "selfish", "hateful", "critical"];
const anticipation = ["curious", "interested", "expectant"];

let selectedWordPool = [];


// screen setting
// let currentScreen = null;
// let screen1 = null;
// let screen2 = null;


// function changeScreen(newScreen) {
//   if (currentScreen != null) {
//     currentScreen.style.display = "none";
//   }
//   currentScreen = newScreen;
//   currentScreen.style.display = "block";
// }


function init() {

  //screen change
  // screen1 = document.getElementById('screen1');
  // screen2 = document.getElementById('screen2');
  // changeScreen(screen1);

  // document.addEventListener('touchmove', function(event) {
  //       event = event.originalEvent || event;
  //       if (event.scale !== 1) {
  //          event.preventDefault();
  //       }
  //   }, false);
  //
  //
  // let lastTouchEnd = 0;
  //   document.addEventListener('touchend', function (event) {
  //     let now = (new Date()).getTime();
  //     if (now - lastTouchEnd <= 300) {
  //       event.preventDefault();
  //     }
  //     lastTouchEnd = now;
  //   }, false);

  //create button
  for (let i = 1; i < 9; i++) {
    (function(i) {
      elem = document.getElementById("button" + i);
      elem.addEventListener(
        "click", send);
    }(i));
  }
}


function send() {
  //max 3 button can be activated
  $(this).toggleClass('active');
  $('button').prop('disabled', false);
  if ($('.active').length >= 3) {
    $('button:not(.active)').prop('disabled', true);

    setTimeout(textAppear, 500);
  }

  //send to socket
  let wordAndColor;

  //store it to send text box in mobile
  if (this.value == '1') {
    wordAndColor = {
      word: joy[Math.floor(Math.random() * joy.length)],
      color: "#F8C633"
    }
    selectedWordPool.push(wordAndColor);
  } else if (this.value == '2') {
    wordAndColor = {
      word: trust[Math.floor(Math.random() * trust.length)],
      color: "#B2BB3A"
    }
    selectedWordPool.push(wordAndColor);
  } else if (this.value == '3') {
    wordAndColor = {
      word: fear[Math.floor(Math.random() * fear.length)],
      color: "#0A6C43"
    }
    selectedWordPool.push(wordAndColor);
  } else if (this.value == '4') {
    wordAndColor = {
      word: surprise[Math.floor(Math.random() * surprise.length)],
      color: "#06809D"
    }
    selectedWordPool.push(wordAndColor);
  } else if (this.value == '5') {
    wordAndColor = {
      word: sadness[Math.floor(Math.random() * sadness.length)],
      color: "#763B7B"
    }
    selectedWordPool.push(wordAndColor);
  } else if (this.value == '6') {
    wordAndColor = {
      word: disgust[Math.floor(Math.random() * disgust.length)],
      color: "#911E47"
    }
    selectedWordPool.push(wordAndColor);
  } else if (this.value == '7') {
    wordAndColor = {
      word: anger[Math.floor(Math.random() * anger.length)],
      color: "#BA273A"
    }
    selectedWordPool.push(wordAndColor);
  } else if (this.value == '8') {
    wordAndColor = {
      word: anticipation[Math.floor(Math.random() * anticipation.length)],
      color: "#D8612B"
    }
    selectedWordPool.push(wordAndColor);
  }

  let sendData = {
    buttonNum: this.value,
    emotionKeyword: wordAndColor.word
  }
  console.log("sent data is " + sendData);
  socket.emit('button', sendData);

}


let finalWord1;
let finalWord2;
let finalWord3;
let finalWord1Color;
let finalWord2Color;
let finalWord3Color;

function textAppear() {
  // console.log($('.active').attr('id'));
  console.log(selectedWordPool);
  finalWord1 = selectedWordPool[selectedWordPool.length - 3].word;
  finalWord2 = selectedWordPool[selectedWordPool.length - 2].word;
  finalWord3 = selectedWordPool[selectedWordPool.length - 1].word;
  finalWord1Color = selectedWordPool[selectedWordPool.length - 3].color;
  finalWord2Color = selectedWordPool[selectedWordPool.length - 2].color;
  finalWord3Color = selectedWordPool[selectedWordPool.length - 1].color;

  // let finalWords = selectedWordPool.join();
  document.getElementById("descSection").innerHTML = "";
  document.getElementById("descSection").style.fontSize = "2.8em";
  document.getElementById("descSection").innerHTML = "<span style='color:" + finalWord1Color + "'>" + finalWord1 + "</span>" + ", " + "<span style='color:" + finalWord2Color + "'>" + finalWord2 + "</span>" + ", " + "<span style='color:" + finalWord3Color + "'>" + finalWord3 + "</span>" + " ??";
  // selectedWordPool = [];
  setTimeout(tweetAppear, 3000);
}

function tweetAppear() {

  $(".button").hide();
  $("#tweetBox").appendTo("#buttonSection");
  console.log("hi");
  console.log(tweetText);

  // changeScreen(screen2);

  document.getElementById("tweet").innerHTML = "";

  let spans = '<span>' + tweetText.split('').join('</span><span>') + '</span>';
  $(spans).hide().appendTo('#tweet').each(function(i) {
    $(this).delay(30 * i).css({
      display: 'inline',
      opacity: 0,
    }).animate({
      opacity: 1
    }, 30);
  });
}


window.addEventListener('load', init);
