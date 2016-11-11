// ==UserScript==

// @match http://youtube.com/*
// @match http://www.youtube.com/*
// @match https://youtube.com/*
// @match https://www.youtube.com/*

// @name        youtube anti-bullying toolkit
// @namespace   youtube_anti_bullying_toolkit
// @version     1
// @grant       none

// ==/UserScript==

let env = {};

env.location = "";
env.container = null;
env.observer = null;

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
];
configuration.filters = [
  "(regex0|regex1)",
  "(regex2|regex3)",
  "(regex4|regex5)"
];
configuration.filterUsers = true;
configuration.filterChannels = true;
configuration.filterPlayLists = true;
configuration.filterContent = true;
configuration.filterClickBaits = true;
configuration.comments = false;
configuration.autoplay = false;
configuration.localize = true;
configuration.removeNode = false;
configuration.quarantineNode = true;
configuration.container = "yt-anti-bullying-toolkit-quarantine-container";

let hp = {};

hp.flatline = function(e, f){
  const parent = e.parentNode
  const next = e.nextSibling
  parent.removeChild(e);
  f(e);
  parent.insertBefore(e, next);
}
hp.parent = function(e, tagName){
  let out = e.parentNode;
  while(out){
   if(out.tagName.toLowerCase() === tagName.toLowerCase()) break;
   out = out.parentNode;
  }
  return out;
}
hp.empty = function(e){
  let node = e.firstChild;
  while(node){
    e.removeChild(node)
    node = e.firstChild
  }
}
hp.isNotHidden = function(e){
  return e.style.display !== "none"
}
hp.hide = function(e){
  e.style.display = "none";
}
hp.block = function(e){
  e.setAttribute("yt-anti-bullying-toolkit-block", "true");
}
hp.clickbait = function(e){
  e.setAttribute("yt-anti-bullying-toolkit-clickbait", "true");
}
hp.remove = function(e){
  e.parentNode.removeChild(e);
}
hp.quarantine = function(e){
  e.parentNode.removeChild(e);
  env.container.appendChild(e);
}

const nUsers = configuration.users.length;
const nChannels = configuration.channels.length;
const nPlayLists = configuration.playLists.length;
const nFilters = configuration.filters.length;

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

let block = function(elements){
  for(var i = 0, N = elements.length; i < N; ++i){
   let e = elements[i];
   if(hp.isNotHidden(e)){
    let node = hp.parent(e, "li");
    if(node){
     if(configuration.removeNode){
      hp.remove(e);
      hp.remove(node);
     }else{
      hp.hide(node);
      hp.block(node);
      hp.hide(e);
      hp.block(e);
      if(configuration.quarantineNode) hp.quarantine(node);
     }
    }
   }
  }
}

let blockByInnerHTML = function(expressions, nExpressions, elements, tagName){
  for(var i = 0, N = elements.length; i < N; ++i){
   let e = elements[i];
   let skip = true;
   for(var j = 0; j < nExpressions; ++j){
    if(expressions[j].test(e.innerHTML) === true){
      skip = false;
      break;
    }
   }
   if(skip) continue;
   if(hp.isNotHidden(e)){
    let node = hp.parent(e, tagName);
    if(node){
     if(configuration.removeNode){
      hp.remove(e);
      hp.remove(node);
     }else{
      hp.hide(node);
      hp.block(node);
      hp.hide(e);
      hp.block(e);
      if(configuration.quarantineNode) hp.quarantine(node);
     }
    }
   }
  }
}

let queries = {};

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
queries.blockByFilter = {};
queries.blockByFilter.query = "li a:not([yt-anti-bullying-toolkit-block])";
queries.blockByFilter.expressions = configuration.filters.map(function(v){ return new RegExp(v, "i"); });
queries.blockByFilter.nExpressions = queries.blockByFilter.expressions.length;
queries.blockClickBaits = {};
queries.blockClickBaits.query = "li a span[class='title']:not([yt-anti-bullying-toolkit-clickbait]), h3[class*='yt-lockup-title'] a:not([yt-anti-bullying-toolkit-clickbait])";
queries.blockClickBaits.allCapsExpression = /^[\s\WA-Z0-9]*$/;

(function(){
  let blockByUserName = "";
  for(var i = 0, N = nUsers; i < N; ++i){
   if(i > 0){
    blockByUserName += ', ';
   }
   blockByUserName += "li a[href='/user/" + configuration.users[i] + "']:not([yt-anti-bullying-toolkit-block])";
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
   blockByChannelName += "li a[href='/channel/" + configuration.channels[i] + "']:not([yt-anti-bullying-toolkit-block])";
   blockByChannelName += ", li span[data-ytid='" + configuration.channels[i] + "']:not([yt-anti-bullying-toolkit-block])";
  }
  queries.blockByChannelName.query = blockByChannelName;
})();

(function(){
  let blockByPlayListName = "";
  for(var i = 0, N = nPlayLists; i < N; ++i){
   if(i > 0){
    blockByPlayListName += ', ';
   }
   blockByPlayListName += "li a[href='/playlist?list=" + configuration.playLists[i] + "']:not([yt-anti-bullying-toolkit-block])";
  }
  queries.blockByPlayListName.query = blockByPlayListName;
})();

let clean = function(){
  hp.flatline(env.container, hp.empty);
}

let blockByUserName = function(){
  block(document.querySelectorAll(queries.blockByUserName.query));
  blockByInnerHTML(queries.blockVideoWallByUserName.expressions, queries.blockVideoWallByUserName.nExpressions, document.querySelectorAll(queries.blockVideoWallByUserName.query), "a");
}

let blockByChannelName = function(){
  block(document.querySelectorAll(queries.blockByChannelName.query));
}

let blockByPlayListName = function(){
  block(document.querySelectorAll(queries.blockByPlayListName.query));
}

let blockByContentFilters = function(){
  blockByInnerHTML(queries.blockByFilter.expressions, queries.blockByFilter.nExpressions, document.querySelectorAll(queries.blockByFilter.query), "li");
}

let blockComments = function(){
  var comments = document.getElementById("watch-discussion");
  if(comments){
    hp.hide(comments);
    comments.setAttribute("yt-anti-bullying-toolkit-no-comment", "true");
  }
}

let blockClickBaitWithAllCaps = function(e){
  let exp = queries.blockClickBaits.allCapsExpression;
  if(exp.test(e.innerHTML) === true){
   if(hp.isNotHidden(e)){
    let node = hp.parent(e, "li");
    if(node){
     if(configuration.removeNode){
      hp.remove(e);
      hp.remove(node);
     }else{
      hp.hide(node);
      hp.clickbait(node);
      hp.hide(e);
      hp.clickbait(e);
      if(configuration.quarantineNode) hp.quarantine(node);
     }
     return true;
    }
   }else{
     return true;
   }
  }
  return false;
}

let blockClickBaits = function(){
  let elements = document.querySelectorAll(queries.blockClickBaits.query);
  for(var i = 0, N = elements.length; i < N; ++i){
   let e = elements[i];
   if(blockClickBaitWithAllCaps(e)) continue;
  }
}

let disableAutoplay = function(){
  let autoplay = document.getElementById("autoplay-checkbox");
  if(autoplay && autoplay.checked === true){
    autoplay.click();
    autoplay.setAttribute("yt-anti-bullying-toolkit-no-autoplay", "true");
  }
}

let reinforceLocalization = function(){
  let elements = document.querySelectorAll("a:not([yt-anti-bullying-toolkit-localize])");
  for(var i = 0, N = elements.length; i < N; ++i){
   let e = elements[i];
   let href = e.href;
   href += (href.indexOf("?") === -1) ? "?" : "&";
   href += "hl=" + configuration.lang;
   e.href = href;
   e.setAttribute("yt-anti-bullying-toolkit-localize", "true");
  }
}

let execute = function(){
  const location = window.location.toString();
  if(env.location !== location) clean();
  if(configuration.filterUsers) blockByUserName();
  if(configuration.filterChannels) blockByChannelName();
  if(configuration.filterPlayLists) blockByPlayListName();
  if(configuration.filterContent) blockByContentFilters();
  if(configuration.filterClickBaits) blockClickBaits();
  if(!configuration.comments) blockComments();
  if(!configuration.autoplay) disableAutoplay();
  if(configuration.localize) reinforceLocalization();
  env.location = location;
}

if(document){
  const body = document.body || null;
  const first = (body) ? body.firstChild || null : null;
  env.container = document.createElement("span");
  env.container.id = configuration.container;
  hp.hide(env.container);
  if(first) body.insertBefore(env.container, first);
  else body.appendChild(env.container);
}

if(document){
  let ctor = (MutationObserver||WebKitMutationObserver);
  env.observer = new ctor(function(mutations){ execute(); });
  env.observer.observe(document.body, { childList: true, subtree: true });
}