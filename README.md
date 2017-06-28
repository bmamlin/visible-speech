<img src="visible-speech.png" />

A hacky little one-page app I built one night to play with Chrome's speech recognition API to communicate better 
with my deaf patients while in the hospital. People had positioned a computer with a terminal at the end of a patient's bed who had recently become deaf. They were typing in notes. I thought, there has to be something better. I tried a handful of phone apps (like [Live Caption](http://www.livecaptionapp.com/)) with some success, but then discovered [Speech Logger](https://speechlogger.appspot.com/en/). Speech Logger's real-time voice-to-text was a better option, but the user interface was cluttered with features we didn't need. Fortunately, the nice people at Speech Logger were kind enough to document the [Web Speech API](https://speechlogger.appspot.com/en/) to get me started.

So, I threw together this little one-page app to leverage the speech recognition generously provided by Google in their Chrome browser. The goal was to make a really simple user interface that would act as a reverse teleprompter for our patient. I had to figure out how to keep it continuously listening, but, once I got past that little hump, it worked well. Even with the built-in microphone on the laptop in the room, it has proven far more useful than hand-typing messages. I threw in a few commands to make it a little more convenient:

* "clear" – clears the screen
* "delete" – deletes the last segment of recognized speech
* "bigger" or "smaller" – change the size of text
* "new line" or "new paragraph" – you can probably guess what these do
* "stop listening" – turns off the mic

So, if you are working with a deaf patient (we're assuming he or she has reasonable vision, can read, can speak, and – like in our case – you don't have more effective &amp; effecient ways to communicate). Place a computer at their bedside with a reasonable microphone, open up [visiblespeech.com](http://visiblespeech.com) with a recent version of Chrome, and start talking to your patient.

Give it a try at http://visiblespeech.com _(requires Chrome browser)_
