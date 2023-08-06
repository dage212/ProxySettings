// chrome.runtime.onMessage.addListener(function(reciver,sender,sendResponse){
//     console.log(reciver,sender,sendResponse)
//     fetch('http://localhost:3000',{
//         method:"GET",
//         headers:reciver.headers
//     }).then(res => {
//         console.log(res)
//         document.getElementById("div").innerHTML=res.status
//     }, err => {
//         console.log(err)
//     })
// })

function dgStr(obj){
    let jsonStr = ''
    for(let key in obj){
       if(typeof obj[key] !== 'object'){
          jsonStr += `<div class="row-box" style="margin-bottom:4px;display:flex"><div style="display:inline-block;text-align:left;width:120px;">${key}:</div><div style="display:inline-block;text-align:left;max-width:300px;overflow-wrap:break-word">${obj[key]}</div></div>`
       }else{
          if(Array.isArray(obj[key])){
             const childStr = dgStr(obj[key])
             jsonStr += `<div class="row-box" style="margin-bottom:4px;display:flex"><div style="display:inline-block;text-align:left;width:120px;">${key}:</div><div style="display:inline-block;text-align:left;max-width:300px;overflow-wrap:break-word">${childStr}</div></div>`
          }else{
 
          }
       }
    }
    return jsonStr
 }
 dgStr(JSON.parse('{"__topic__":"event","__logs__":[{"client_type":"web","device_id":"3r2h2zTo-9Hh6-q6bF-1j5r-WqzR9QosTiyR","app_version":"2.3.9-alpha.1","os_arch":"amd64","os_release":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 TIMEWORKER","platform":"win32","date":"20230730","time":"2023-07-30 03:55:03","user_id":"1054144","project_id":"1707613","team_id":"947096","event":"runHttpApi"}]}'))