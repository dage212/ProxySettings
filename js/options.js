const arr =[
    {
        name:'Authorization',
        value:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA1NDE0NCwidHMiOiI1NGI5YTFjNTI0ZmExOGRlIiwiaWF0IjoxNjkwMTIxMDg0Mjc2fQ.rOgMhX4HHhrpxHhpTTRROVlxHdlZjFukR1JThC5fdNU'
    },
    {
        name:'Accept-Encoding',
        value:'gzip, deflate, br'
    },
    {
        name:'Accept-Encoding',
        value:'gzip, deflate, br'
    }
]
function dgStr(obj){
    let jsonStr = ''
    for(let key in obj){
       if(typeof obj[key] !== 'object'){
          jsonStr += `<div class="row-box" style="margin-bottom:4px;display:flex"><div style="display:inline-block;text-align:left;width:120px;">${key}:</div><div style="display:inline-block;text-align:left;max-width:300px;overflow-wrap:break-word">${obj[key]}</div></div>`
       }else{
          if(Array.isArray(obj[key])){
                let childStr = ''
                obj[key].forEach(val => {
                   childStr = dgStr(val)
                })
                jsonStr += `<div class="row-box" style="margin-bottom:4px;display:flex"><div style="display:inline-block;text-align:left;width:120px;">${key}:</div><div style="display:inline-block;text-align:left;max-width:300px;overflow-wrap:break-word">${childStr}</div></div>`
          }else{
                let childStr = ''
                for(let keyc in obj[key]){
                   childStr = dgStr(obj[key][keyc])
                }
                jsonStr += `<div class="row-box" style="margin-bottom:4px;display:flex"><div style="display:inline-block;text-align:left;width:120px;">${key}:</div><div style="display:inline-block;text-align:left;max-width:300px;overflow-wrap:break-word">${childStr}</div></div>`
          }
       }
    }
    return jsonStr
 }
 document.getElementById('request').addEventListener('blur',function(e){
    let jsonStr = '{'
    for(let i = 0; i < arr.length; i ++){
       const header = arr[i]
       jsonStr += `<div class="row-box" style="margin-bottom:4px;display:flex"><div style="display:inline-block;text-align:left;width:120px;">${header.name}:</div><div style="display:inline-block;text-align:left;max-width:300px;overflow-wrap:break-word">${header.value}</div></div>`
    }
    jsonStr += '</br>}'
    jsonStr = dgStr({
        os_release:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 TIMEWORKER',
        device_id:'3r2h2zTo-9Hh6-q6bF-1j5r-WqzR9QosTiyR'
    })
    document.getElementById('request_body').innerHTML = jsonStr
 }) 
 