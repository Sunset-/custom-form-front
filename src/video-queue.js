
var utterThis = null;
var speekTimer = null;
var speekTimer2 = null;

function speek(text) {
    var dingdong = document.getElementById('dingdong');
    dingdong.play();
    window.speechSynthesis.speaking && window.speechSynthesis.cancel(utterThis);
    clearTimeout(speekTimer);
    clearTimeout(speekTimer2);
    speekTimer = setTimeout(function () {
        utterThis = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterThis);
        speekTimer2 = setTimeout(function(){
            window.speechSynthesis.speak(utterThis);
        },1000);
    }, 2500);
}


window.refreshQueue = function () {
    $.ajax({
        url : '/service/business/videoQueue',
        data : {
            pageNumber : 0,
            pageSize : 10,
            status : '1,2,3'
        }
    }).then(res=>{
        debugger;
    })
}


//心跳
setInterval(() => {
    if (window.opener) {
        window.opener.GlobalVideoQueueWindow = window;
    } else {
        window.close();
    }
    var now = new Date();
    var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    $("#currentdate").html(`${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes()}:${now.getSeconds()<10?'0'+now.getSeconds():now.getSeconds()} ${week[now.getDay()]}`)
}, 500)