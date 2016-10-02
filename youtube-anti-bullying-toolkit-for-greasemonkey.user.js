// ==UserScript==

// @match http://youtube.com/*
// @match http://www.youtube.com/*
// @match https://youtube.com/*
// @match https://www.youtube.com/*

// @name        youtube anti-bullying toolkit
// @namespace   youtube_anti_bullying_toolkit
// @version     1
// @grant       none

// @edited      10/2/2016

// ==/UserScript==

let configuration = {};

configuration.lang = "en";
configuration.users = [
  "user0",
  "user1",
  "user2"
];
configuration.channels = [
  "channel0",
  "channel1",
  "channel2"
];
configuration.playLists = [
  "playList0",
  "playList1",
  "playList2"
]
configuration.displayUsers = false;
configuration.displayChannels = false;
configuration.displayPlayLists = false;
configuration.displayComments = false;
configuration.autoplay = false;
configuration.localize = true;

const nUsers = configuration.users.length;
const nChannels = configuration.channels.length;
const nPlayLists = configuration.playLists.length;

(function(){
  if(!configuration.localize) return;
  if(!location) return;
  let q = location.search;
  if(q === ""){
   location += "?hl=" + configuration.lang;
  }else{
   q = q.substr(1);
   let queries = q.split("&");
   for(var i = 0, N = queries.length; i < N; ++i){
    let kv = queries[i].split("=");
    if(kv[0].toLowerCase() === "hl"){
     configuration.lang = kv[1].toLowerCase();
     return;
    }
   }
   location += "&hl=" + configuration.lang;
  }
})();

var block = function(elements){
  for(var i = 0, N = elements.length; i < N; ++i){
    var e = elements[i];
    if(e.style.display != "none"){
     var node = e.parentNode;
     while(node){
      if(node.tagName.toLowerCase() === "li") break;
      node = node.parentNode;
     }
     if(node){
      node.style.display = "none";
      node.setAttribute("blocked", "true");
      e.style.display = "none";
     }
    }
  }
}

var blockByInnerHTML = function(expressions, nExpressions, elements){
  for(var i = 0, N = elements.length; i < N; ++i){
    var e = elements[i];
    var skip = true;
    for(var j = 0; j < nExpressions; ++j){
     if(expressions[j].test(e.innerHTML) === true){
       skip = false;
       break;
     }
    }
    if(skip) continue;
    if(e.style.display != "none"){
       var node = e.parentNode;
       while(node){
        if(node.tagName.toLowerCase() === "a") break;
        node = node.parentNode;
       }
       if(node){
        node.style.display = "none";
        node.setAttribute("blocked", "true");
        e.style.display = "none";        
       }
    }
  }
}

var queries = {};

queries.blockByUserName = {};
queries.blockByUserName.query = "";
queries.blockVideoWallByUserName = {};
queries.blockVideoWallByUserName.query = "";
queries.blockVideoWallByUserName.expressions = [];
queries.blockVideoWallByUserName.nExpressions = 0;
queries.blockByChannelName = {};
queries.blockByChannelName.query = "";
queries.blockByPlayListName = {};
queries.blockByPlayListName.query = "";

(function(){
  let blockByUserName = "";
  for(var i = 0, N = nUsers; i < N; ++i){
   if(i > 0){
    blockByUserName += ', ';
   }
   blockByUserName += "li a[href='/user/" + configuration.users[i] + "']";
   queries.blockVideoWallByUserName.expressions.push(new RegExp(configuration.users[i], "i"))
  }
  queries.blockByUserName.query = blockByUserName;
  queries.blockVideoWallByUserName.query = "a span[class*='ytp-videowall-still-info-author']";
  queries.blockVideoWallByUserName.nExpressions = queries.blockVideoWallByUserName.expressions.length;
})();

(function(){
  let blockByChannelName = "";
  for(var i = 0, N = nChannels; i < N; ++i){
   if(i > 0){
    blockByChannelName += ', ';
   }
   blockByChannelName += "li a[href='/channel/" + configuration.channels[i] + "']";
   blockByChannelName += ", li span[data-ytid='" + configuration.channels[i] + "']";
  }
  queries.blockByChannelName.query = blockByChannelName;
})();

(function(){
  let blockByPlayListName = "";
  for(var i = 0, N = nPlayLists; i < N; ++i){
   if(i > 0){
    blockByPlayListName += ', ';
   }
   blockByPlayListName += "li a[href='/playlist?list=" + configuration.playLists[i] + "']";
  }
  queries.blockByPlayListName.query = blockByPlayListName;
})();

var blockByUserName = function(){
  block(document.querySelectorAll(queries.blockByUserName.query));
  blockByInnerHTML(queries.blockVideoWallByUserName.expressions, queries.blockVideoWallByUserName.nExpressions, document.querySelectorAll(queries.blockVideoWallByUserName.query));
}

var blockByChannelName = function(){
  block(document.querySelectorAll(queries.blockByChannelName.query));
}

var blockByPlayListName = function(){
  block(document.querySelectorAll(queries.blockByPlayListName.query));
}

var blockComments = function(){
  var comments = document.getElementById("watch-discussion");
  if(comments){
    comments.style.display = 'none';
    comments.setAttribute("blocked", "true");
  }
}

var disableAutoplay = function(){
  var autoplay = document.getElementById("autoplay-checkbox");
  if(autoplay && autoplay.checked === true){
    autoplay.click();
    autoplay.setAttribute("blocked", "true");
  }
}

var reinforceLocalization = function(){
  let elements = document.querySelectorAll("a:not([localized])");
  for(var i = 0, N = elements.length; i < N; ++i){
   let e = elements[i];
   let href = e.href;
   href += (href.indexOf("?") === -1) ? "?" : "&";
   href += "hl=" + configuration.lang;
   e.href = href;
   e.setAttribute("localized", "true");
  }
}

var execute = function(){
  if(!configuration.displayUsers) blockByUserName();
  if(!configuration.displayChannels) blockByChannelName();
  if(!configuration.displayPlayLists) blockByPlayListName();
  if(!configuration.displayComments) blockComments();
  if(!configuration.autoplay) disableAutoplay();
  if(configuration.localize) reinforceLocalization();
}

var observer = null;

if(document){
  var ctor = (MutationObserver||WebKitMutationObserver);
  observer = new ctor(function(mutations){ execute(); });
  observer.observe(document.body, { childList: true, subtree: true });
}