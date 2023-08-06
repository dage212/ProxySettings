// 'use strict';

// chrome.webRequest.onBeforeRequest.addListener(
//    function(details) {
//        console.log(details.requestBody)
//        let rs = new Uint8Array(details.requestBody.raw[0].bytes)
//        let Td = new TextDecoder()
//        let r = Td.decode(rs)
//        chrome.runtime.sendMessage(null,r)
//    },
//    {
//       urls: [
//          "*://*/*"
//       ],
//       types:[
//          "xmlhttprequest",
//          "main_frame"
//       ]
//    },
//    ["extraHeaders","requestBody"]
//   );

// chrome.webRequest.onBeforeSendHeaders.addListener(
//    function(details) {
//       chrome.runtime.sendMessage('',details)
//    },
//    {
//       urls: [ "*://*/*"],
//       types:["xmlhttprequest","main_frame"]
//    },
//    ["extraHeaders","requestHeaders"]
// );

 
