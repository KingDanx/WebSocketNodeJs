# WebSocketNodeJs

This includes a NodeJs Websocket Server, 2 web clients (index.html && index2.html), and code that will connect an Arduino device with an 8266 wifi chip to the NodeJs server.

The included C++ library was modified on the WebSocketsClient.cpp file to allow the NodeJs server to authenticate it on reconnects in the event the server went down.

The two web clietns feed data to the NodeJs server via websocket.

App.js is fed data from the NodeJs server depending on what data it got from the clients.

If both clients send a true value to the NodeJs server, the app.html client will change it's styling and start a timer for the duration of the true values.  As soon as one value is changed to false, the timer stops.
