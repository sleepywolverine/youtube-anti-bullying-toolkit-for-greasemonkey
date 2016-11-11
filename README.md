# youtube anti-bullying toolkit for greasemonkey
_blocks users, channels, topics, playlists, comments, clickbaits, disable autoplay, reinforce localization_...

### installation
- greasemonkey (firefox)
> https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/

- application (a.k.a. user) script - greasmonkey will automatically ask you if you would like to install it
> https://github.com/sleepywolverine/youtube-anti-bullying-toolkit-for-greasemonkey/raw/master/youtube-anti-bullying-toolkit-for-greasemonkey.user.js

### configuration

```javascript
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
```

### about the "content filter" feature
marks any content that has a match in the defined regex pattern list as blocked

```javascript
configuration.filters = [
  "(regex0|regex1)",
  "(regex2|regex3)",
  "(regex4|regex5)"
];
```

- please visit the following website to learn more about regular expressions
> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

### about the "clickbait" feature
marks any content with all caps title as clickbait

### about the "reinforce localzation" feature
it reduces the occurence of unexpected foreign languages on the visited page

this issue might be related to the youtube's localization system

__temporary solution:__
- it appends the "hl=your_preferred_language" magic querystring to every link
- if the visited page does not have the magic querystring then the user will be redirected to the same page with the magic querystring appended, e.g.: youtube.com becomes youtube.com?hl=en

```javascript
configuration.lang = "en";
configuration.localize = true;
```

### chrome support
the script might work with chrome (with or without tampermonkey)

### development
feel free to fork it, copy it, change it

### important note
the script itself...
- ...does not copy or alter any user data
- ...does not monitor any user activity
- ...does not require any youtube account


_stay safe!_
