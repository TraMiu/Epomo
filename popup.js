function average(array){

    const arr = array;
    const average = arr.reduce((a, b) => a + b, 0) / arr.length;
    if(!isNaN(average)){
        return average.toFixed(2);
    } else return "";
}

$(function(){
    var today = new Date().getDate();


    chrome.storage.local.get({
        streak:[]
    },
    function(local){

        chrome.storage.sync.get([
            'currentDay', 'todayTotal'
        ], 
        function(sync){
            if(today != sync.currentDay){
                var stats = local.streak;
                stats.push(sync.todayTotal);
                chrome.storage.local.set({streak: stats});
                $("#stats").text(stats);
                $("#average").text(average(stats));

                chrome.storage.sync.set({todayTotal: 0});
                $("#sessionToday").text(0);
                chrome.storage.sync.set({currentDay: today});
            } else {
                $("#sessionToday").text(sync.todayTotal);
                $("#stats").text(local.streak);
                $("#average").text(average(local.streak));
            }
        })
        
    })

    var remainTime = chrome.extension.getBackgroundPage().distance;
    if(!isNaN(remainTime) && remainTime > 0){
        chrome.runtime.sendMessage({action: "resume"});
    } else {
        chrome.runtime.sendMessage({action: "resetClock"});
    }

    $("#btnDelete").click(function(){
        chrome.runtime.sendMessage({action: "deleteSession"});
    })

    $("#btnReset").click(function(){
        chrome.runtime.sendMessage({action: "resetClock"});
    })

    $("#btnFreeze").click(function(){
        chrome.runtime.sendMessage({action: "freezeClock"});
    })

    $("#btnResume").click(function(){
        chrome.runtime.sendMessage({action: "resumeSession"});
    })

    var update = setInterval(function(){
        $("#countdown").text(chrome.extension.getBackgroundPage().displayTimer());
    }, 1000)
    
})

chrome.storage.onChanged.addListener(function(changes, storageName){
    $("#sessionToday").text(changes.todayTotal.newValue.toString());
})








