var listening = false;
var autoRestart = true;
var keepAliveTimer;
var lastKeepAliveTime = 0;
var cycle = 0;

if (!('webkitSpeechRecognition' in window)) {
    incompatible();
    recognition = {};
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US"; 
    recognition.maxAlternatives = 1;
    keepAlive();
}

var commands = [
    {
        "when": /^(clear|clear screen)$/i,
        "do": function(e) { clearScreen(); }
    },
    {
        "when": /^stop listening$/i,
        "do": function(e) {
            $(':last', '#out').remove();
            startButton();
        }
    },
    {
        "when": /^\n\n+$/,
        "do": function(e) {
            $(':last', '#out').remove();
            $('#out').append('<div class="output paragraph"></div>');
        }
    },
    {
        "when": /^\n$/,
        "do": function(e) {
            $(':last', '#out').remove();
            $('#out').append('<div class="output newline"></div>');
        }
    },
    {
        "when": /^(zoom in|bigger)$/i,
        "do": function(e) {
            $(':last', '#out').remove();
            setTimeout(increaseFont, 10);
        }
    },
    {
        "when": /^(zoom out|smaller)$/i,
        "do": function(e) {
            $(':last', '#out').remove();
            setTimeout(decreaseFont, 10);
        }
    },
    {
        "when": /^(undo|delete)$/i,
        "do": function(e) {
            $(':nth-last-child(-n+2)', '#out').remove();
        }
    }
    ];

recognition.onstart = function() {
    cycle++;
    listening = true;
};

recognition.onend = function() {
    if (autoRestart) {
        recognition.start();
    } else {
        console.log("stopped listening");
        listening = false;
        $('#mic').removeClass('on');
    }
};

recognition.onresult = function(event) {
    if (typeof(event.results) === 'undefined') {
        recognition.stop();
        return;
    }
    var out = '';
    var isFinal = true;
    for (var i = event.resultIndex; i < event.results.length; i++) {
        if (!event.results[i].isFinal) isFinal = false;
        out = out + event.results[i][0].transcript + ' ';
    }
    out = out.replace(/^ +| +$/g,''); // trim, preserving newlines
    if (isFinal) {
        for (var i=0; i < commands.length; i++) {
            if (commands[i].when.test(out)) {
                commands[i].do(event);
                return;
            }
        }
    }
    var elemId = 'i' + cycle + '-' + event.resultIndex;
    var elem = $('#' + elemId);
    if (!elem.length) {
        elem = $('<span id="'+elemId+'" class="output"></span>');
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
        if (!recognition.start) {
            return;
        }
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

function incompatible() {
    setTimeout(function() {$('#incompatible').show();}, 0);
}