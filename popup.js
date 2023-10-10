

$(function(){
    var today = new Date().getDate();

    // $("#stats").text(chrome.extension.getBackgroundPage().getStats());

    chrome.storage.sync.get(['currentDate', 'todayTotal'], function(data){
        if(data.currentDate != today){
            // var currentDayTotal = data.todayTotal;
            // chrome.storage.sync.sendMessage({action: "addCurrentDayStatistic-" + currentDayTotal.toString()}, function(){
            //     $("#stats").text(chrome.extension.getBackgroundPage().getStats());
            // });
            chrome.storage.sync.set({"todayTotal": 0});
            $("#sessionToday").text(0);
            chrome.storage.sync.set({"currentDate": today});
        } else {
            $("#sessionToday").text(data.todayTotal);
        }
    })
    

    var remainTime = chrome.extension.getBackgroundPage().distance;
    if(!isNaN(remainTime) && remainTime > 0){
        chrome.runtime.sendMessage({action: "resume"});
    } else {
        chrome.runtime.sendMessage({action: "resetClock"});
    }

    var update = setInterval(function(){
        $("#countdown").text(chrome.extension.getBackgroundPage().displayTimer());
    }, 1000)
    
})

chrome.storage.onChanged.addListener(function(changes, storageName){
    $("#sessionToday").text(changes.todayTotal.newValue.toString());
})








