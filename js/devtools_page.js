chrome.devtools.panels.create(
    "Proxy Settings",
    "../images/16.jpg",
    "../html/devtools_page.html",
    function(panel) {  
       console.log(panel)
    }
);

//渲染formData参数
function formDataToHtml(obj){
   let rs = ''
   if(Array.isArray(obj)){ //数组
      return obj
   }else{ //对象
      for(let key in obj){
         rs += `<div class="row-box"><div class="row-box-label">${key}:</div><div class="row-box-content">${obj[key]}</div></div>`
      }
   }
   return rs
}
function dataInsertHtml(obj){
   let dataHtml = ''
   for(let key in obj){
      if(typeof obj[key] !== 'object'){
         dataHtml += `<div class="row-box"><div class="row-box-label">${key}:</div><div class="row-box-content">${obj[key]}</div></div>`
      }else{
         if(Array.isArray(obj[key])){
               let childStr = ''
               obj[key].forEach(val => {
                  childStr = dataInsertHtml(val)
               })
               dataHtml += `<div class="row-box" style="margin-bottom:4px;display:flex"><div style="display:inline-block;text-align:left;width:120px;">${key}:</div><div style="display:inline-block;text-align:left;max-width:420px;overflow-wrap:break-word">${childStr}</div></div>`
         }else{
               let childStr = ''
               for(let keyc in obj[key]){
                  childStr = dataInsertHtml(obj[key][keyc])
               }
               dataHtml += `<div class="row-box" style="margin-bottom:4px;display:flex"><div style="display:inline-block;text-align:left;width:120px;">${key}:</div><div style="display:inline-block;text-align:left;max-width:420px;overflow-wrap:break-word">${childStr}</div></div>`
         }
      }
   }
   return dataHtml
}
function ajaxFetch({headers,method,url,body}){
   if(headers !== undefined){
      ajaxFetch.headers = headers
   }
   if(url !== undefined){
      ajaxFetch.method = method
      ajaxFetch.url = url
      ajaxFetch.body = body
   }

   if(ajaxFetch.flagNum < 1){ //请求两次
      ajaxFetch.flagNum += 1
      return
   }
   ajaxFetch.flagNum = 0
   fetch(ajaxFetch.url,{
      headers:ajaxFetch.headers,
      method:ajaxFetch.method,
      body:ajaxFetch.method=== 'GET'?null:ajaxFetch.body,
      credentials:'include'
   })
   .then(async res => {
      document.getElementById("request_response_box").innerHTML= await res.text()
   }).catch(err => {
      document.getElementById("request_response_box").innerHTML = JSON.stringify(err)
   })
}
ajaxFetch.flagNum = 0

let localhostUrl = ''
let localhostMethod = ''
let proxyUrl = ''
chrome.webRequest.onBeforeRequest.addListener(
   function(details) {
      let data = ''
      let dataHtml = ''
      let body = null
      const method = details.method
      
      if(!details.url.includes(proxyUrl)){
         return
      }  

      if(method.toLocaleLowerCase() !== localhostMethod.trim().toLocaleLowerCase()){//请求方式不对阻止执行
         return
      }
      try {
         if(details.requestBody){// post delete put请求参数获取
            if(details.requestBody.formData){ //formData格式
               const formData = details.requestBody.formData
               dataHtml  = formDataToHtml(formData) 
               body = new FormData()
               for(let key in formData){
                  body.append(`${key}`,formData[key])
               }
            }
            if(details.requestBody.raw){
               const bytes = new Uint8Array(details.requestBody.raw[0].bytes)
               const textDecoder = new TextDecoder()
               data = textDecoder.decode(bytes)
               body = data//获取请求参数 字符串
               if(data.length > 0){
                  const obj = JSON.parse(data)
                  dataHtml += dataInsertHtml(obj) 
               }else{
                  dataHtml += dataInsertHtml(details)
               }
            }
            if(details.requestBody.error){
               document.getElementById('proxy_response').innerHTML = `<span style="color:red">${details.requestBody.error}</span>`
            }

         }else{// get请求参数获取
            const urlObj = new URL(details.url)
            body = urlObj.search.slice(1)
         }
      } catch (error) {
         dataHtml += dataInsertHtml(details)
      }
      const urlObj = new URL(details.url)
      const url = localhostUrl + urlObj.pathname + urlObj.search
      
      ajaxFetch({body,method,url})
      //请求参数赋值
      document.getElementById("url").innerHTML = url
      document.getElementById("method").innerHTML = method
      document.getElementById("payload").innerHTML = body
      document.getElementById("request_body_box").innerHTML = dataHtml
      document.getElementById("remote_address").innerHTML = details.url
   },
   {
      urls: [
         "*://*/*",
         // e.target.value.replace(/^\s*|\s*$/g,''),
      ],
      types:[
         "xmlhttprequest",
         "main_frame"
      ]
   },
   ["extraHeaders","requestBody"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
   function(details) {
      const headers = {}

      if(!details.url.includes(proxyUrl)){
         return
      } 

      if(details.method.toLocaleLowerCase() !== localhostMethod.trim().toLocaleLowerCase()){//请求方式不对阻止执行
         return
      }

      let dataHtml = ''
      for(let i = 0; i < details.requestHeaders.length; i ++ ){
         const header = details.requestHeaders[i]
         headers[header.name] = header.value
      }
      ajaxFetch({headers})
      for(let i = 0; i < details.requestHeaders.length; i ++){
         const header = details.requestHeaders[i]
         dataHtml += `<div class="row-box" style="margin-bottom:4px;display:flex"><div style="display:inline-block;text-align:left;width:120px;">${header.name}:</div><div style="display:inline-block;text-align:left;max-width:300px;overflow-wrap:break-word">${header.value}</div></div>`
      }
      document.getElementById('request_header_box').innerHTML = dataHtml
   },
   {
      urls: [
          "*://*/*",
            // e.target.value.replace(/^\s*|\s*$/g,'')
         ],
      types:["xmlhttprequest","main_frame"]
   },
   ["extraHeaders","requestHeaders"]
);
document.getElementById('proxy_url').addEventListener('blur',function(e){
  proxyUrl = e.target.value.replace(/^\s*|\s*$/g,'')
}) 

document.getElementById('localhost_url').addEventListener('blur',function(e){
   localhostUrl = e.target.value.replace(/^\s*|\s*$/g,'') //去掉空格
})
document.getElementById('proxy_method').addEventListener('blur',function(e){
   localhostMethod = e.target.value.replace(/^\s*|\s*$/g,'')
})
 