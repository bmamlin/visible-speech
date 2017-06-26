var listening = false;
var autoRestart = true;
var keepAliveTimer;
var lastKeepAliveTime = 0;
var cycle = 0;

if (!('webkitSpeechRecognition' in window)) {
    //Speech API not supported here…
} else { //Let’s do some cool stuff :)
    var recognition = new webkitSpeechRecognition(); //That is the object that will manage our whole recognition process. 
    recognition.continuous = true;   //Suitable for dictation. 
    recognition.interimResults = true;  //If we want to start receiving results even if they are not final.
    //Define some more additional parameters for the recognition:
    recognition.lang = "en-US"; 
    recognition.maxAlternatives = 1; //Since from our experience, the highest result is really the best...
}
keepAlive();

recognition.onstart = function() {
    //Listening (capturing voice from audio input) started.
    //This is a good place to give the user visual feedback about that (i.e. flash a red light, etc.)
    console.log("listening");
    cycle++;
    listening = true;
};

recognition.onend = function() {
    //Again – give the user feedback that you are not listening anymore. If you wish to achieve continuous recognition – you can write a script to start the recognizer again here.
    if (autoRestart) {
        recognition.start();
    } else {
        console.log("stopped listening");
        listening = false;
        $('#mic').removeClass('on');
    }
};

recognition.onresult = function(event) { //the event holds the results
//Yay – we have results! Let’s check if they are defined and if final or not:
    if (typeof(event.results) === 'undefined') { //Something is wrong…
        recognition.stop();
        return;
    }

    var out = '';
    var isFinal = true;
    for (var i = event.resultIndex; i < event.results.length; i++) {
        if (!event.results[i].isFinal) isFinal = false;
        out = out + event.results[i][0].transcript + ' ';
    }
    out = out.replace(/^ +| +$/g,''); // remove spaces (not newlines)
    if (isFinal) {
        if (/^clear|clear screen$/i.test(out)) {
            clearScreen();
            return;
        }
        if (/^stop listening$/i.test(out)) {
            $(':last', '#out').remove();
            startButton();
            return;
        }
        if (/^\n\n+$/.test(out)) {
            $(':last', '#out').remove();
            $('#out').append('<div class="output paragraph"></div>');
            return;
        }
        if (/^\n$/.test(out)) {
            $(':last', '#out').remove();
            $('#out').append('<div class="output newline"></div>');
            return;
        }
        if (/^zoom in|bigger$/i.test(out)) {
            $(':last', '#out').remove();
            setTimeout(increaseFont, 10);
            return;
        }
        if (/^zoom out|smaller$/i.test(out)) {
            $(':last', '#out').remove();
            setTimeout(decreaseFont, 10);
            return;
        }
        if (/^undo|delete$/i.test(out)) {
            $(':nth-last-child(-n+2)', '#out').remove();
            return;
        }
    }
    var elemId = 'i' + cycle + '-' + event.resultIndex;
    var elem = $('#' + elemId);
    if (!elem.length) {
        elem = $('<span id="'+elemId+'" class="output"></span>');
        //console.log(div);
        $('#out').append(elem);
    }
    if (isFinal) {
        $(elem).addClass('final');
        prune();
    }
    $(elem).text(out);
    if (isFinal) {
        keepAliveCheck();
    }
    $('html, body').animate({
        scrollTop: $(document).height()
    }, 'fast');
}; 

/*
recognition.onerror = function(event) {
    console.log("error event!");
    console.log(event);
};

recognition.onspeechend = function(event) {
    console.log("speech end");
    console.log(event);
}

recognition.onsaudioend = function(event) {
    console.log("audio end");
    console.log(event);
}
*/

function keepAlive() {
    recognition.stop();
    lastKeepAliveTime = new Date().getTime();
    clearInterval(keepAliveTimer);
    keepAliveTimer = setTimeout(keepAlive, 30000)
}

function keepAliveCheck() {
    if (new Date().getTime() - lastKeepAliveTime > 10000) {
        keepAlive();
    }
}

function startButton() {
    if (listening) {
        autoRestart = false;
        recognition.stop();
    } else {
        recognition.start();
        autoRestart = true;
        clearScreen();
        $('#mic').addClass('on');
    }
}

function getFontSize() {
    return parseInt(/(\d+)pt/.exec(document.styleSheets[1].cssRules[0].style.fontSize)[1]);
}

function setFontSize(fontSize) {
    if (fontSize >= 8 && fontSize <= 150) {
        document.styleSheets[1].cssRules[0].style.fontSize = fontSize + 'pt';
        localStorage.setItem('visiblespeech.fontSize', fontSize);
    }
}

function increaseFont() {
    setFontSize(getFontSize() + 4);
}

function decreaseFont() {
    setFontSize(getFontSize() - 4);
}

function clearScreen() {
    $('#out').empty();
}

function prune() {
    $(':not(:nth-last-child(-n+100))', '#out').remove();
}