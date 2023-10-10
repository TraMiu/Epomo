var distance;
const song = new Audio("clock-alarm-8761.mp3");
var countDownDate;

chrome.storage.sync.get(["todayTotal"], function(data){
    chrome.browserAction.setBadgeText({text: data.todayTotal + "/8"});
})

chrome.runtime.onMessage.addListener(
    function(request) {
      
      if (request.action == "resume") {
        updateCountDownDate(distance);
      }

     
      
      if (request.action == "resetClock"){
        resetTimer();
      } 
    },
);

function updateCountDownDate(remainTime){
    countDownDate = new Date().getTime() + remainTime;
}

function resetTimer(min = 1){
    const startTime = new Date();
    countDownDate = startTime.setMinutes(startTime.getMinutes() + min);
    countDown();
}



function countDown(){

    var update = setInterval(function(){
        var now = new Date().getTime();
    
        // Find the distance between now and the count down date
        distance = countDownDate - now;     

        // If the count down is over, write some text 
        if (distance < 0) {

            clearInterval(update);   

            song.play(); 
            chrome.storage.sync.get(["todayTotal"], function(data){
                chrome.storage.sync.set({"todayTotal": data.todayTotal + 1});
            })
            chrome.notifications.create(
                "limitNotif",
                {
                    type: "basic",
                    iconUrl: "icon48.png",
                    title: "Sessions is over",
                    message: "Congratulation! You have finished a Pomodoro session."
                }
            );           
            
                     
        }
    }, 1000)

    
}

function displayTimer(){
    
    if(distance < 0){
        return "EXPIRED";
    }
    if(isNaN(distance)){
        return "--m --s";
    }

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
    // Output the result in an element with id="demo"
    return minutes + "m " + seconds + "s ";
}

chrome.storage.onChanged.addListener(function(changes, storageName){
    chrome.browserAction.setBadgeText({text: changes.todayTotal.newValue.toString() + "/8"});
})



