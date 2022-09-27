#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <WebSocketsClient.h>

#include <Hash.h>

#include <WiFiCredentials.h>

ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

unsigned long previousMillis  = 0;
unsigned long currentMillis   = 0;
int interval = 1000;
int minute = 0;
int minute2 = 0;
int sec = 0;
int sec2 = 0;
String timer = "hi";

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{

	switch (type)
	{
	case WStype_DISCONNECTED:
		Serial.printf("[WSc] Disconnected!\n");
    webSocket.begin(IP, PORT, "/", PROTOCOL);

		break;
	case WStype_CONNECTED:
	{
		Serial.printf("[WSc] Connected to url: %s\n", payload);

		// send message to server when Connected
		webSocket.sendTXT("Connected");
	}
	break;
	case WStype_TEXT:
		Serial.printf("[WSc] get text: %s\n", payload);

		// send message to server
		webSocket.sendTXT("message here");
		break;
	case WStype_BIN:
		Serial.printf("[WSc] get binary length: %u\n", length);
		hexdump(payload, length);

		// send data to server
		// webSocket.sendBIN(payload, length);
		break;
	case WStype_PING:
		// pong will be send automatically
		Serial.printf("[WSc] get ping\n");
		break;
	case WStype_PONG:
		// answer to a ping we send
		Serial.printf("[WSc] get pong\n");
		break;
	}
}

void setup()
{ 

  Serial.print(timer);
  pinMode(D1, INPUT_PULLUP);

	// Serial.begin(921600);
	Serial.begin(9600);

	// Serial.setDebugOutput(true);
	Serial.setDebugOutput(true);

	Serial.println();
	Serial.println();
	Serial.println();

	for (uint8_t t = 4; t > 0; t--)
	{
		Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
		Serial.flush();
		delay(1000);
	}

	WiFiMulti.addAP(SSID, PASSWORD);

	// WiFi.disconnect();
	while (WiFiMulti.run() != WL_CONNECTED)
	{
		delay(100);
	}

	// server address, port and URL
	webSocket.begin(IP, PORT, "/", PROTOCOL);

	// event handler
	webSocket.onEvent(webSocketEvent);

	// use HTTP Basic Authorization this is optional remove if not needed
	// webSocket.setAuthorization("user", "Password");
  

	// try ever 5000 again if connection has failed
	webSocket.setReconnectInterval(5000);

	// start heartbeat (optional)
	// ping server every 15000 ms
	// expect pong from server within 3000 ms
	// consider connection disconnected if pong is not received 2 times
	webSocket.enableHeartbeat(15000, 3000, 2);

}

void loop()
{
  int sensorVal = digitalRead(D1);
  currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval == true ) {
    sec++;
    if(sec > 9){
      sec = 0;
      sec2++;
    }
    if(sec2 > 5){
      minute++;
      sec2 = 0;
      sec = 0;
    }
    if(minute > 9){
      minute2++;
      minute = 0;
      sec2 = 0;
      sec = 0;
    }

    if(sensorVal == LOW){
      timer = String("true, ") + minute2 + String("") + minute + String(":") + sec2 + String("") + sec;
      webSocket.sendTXT(timer);
    }
    else{
      minute2 = 0;
      minute = 0;
      sec2 = 0;
      sec = 0;
      timer = String("false, ") + minute2 + String("") + minute + String(":") + sec2 + String("") + sec;
      webSocket.sendTXT(timer);
    }

    previousMillis = currentMillis;
  }

	webSocket.loop();

  if(sensorVal == LOW){
    timer = String("true, ") + minute2 + String("") + minute + String(":") + sec2 + String("") + sec;
    webSocket.sendTXT(timer);
  }
  else{
    timer = String("false, ") + minute2 + String("") + minute + String(":") + sec2 + String("") + sec;
    webSocket.sendTXT(timer);
  }
  delay(500);
  timer = "";
}
