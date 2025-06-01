#include <Wire.h>
#include <WiFi.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>
#include <FastLED.h>

const char* ssid = "Ashkan's ESP32";
const char* password = "password";
AsyncWebServer server(80);

#define DHT_PIN 4
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);

#define LDR_PIN 32
#define BUZZER_PIN 5

#define SCL 18
#define SDO 19

#define NUM_LEDS 8
#define LED_PIN 16

CRGB leds[NUM_LEDS];
CRGB red = CRGB::Green;
CRGB green = CRGB::Red;
CRGB blue = CRGB::Blue;
CRGB white = CRGB::White;
CRGB yellow = CRGB::Yellow;
CRGB maroon = CRGB::Maroon;
CRGB turnOff = CRGB::Black;

float temperature, humidity;
int lightLevel, pressedKey;
bool buzzer = false;
bool heater = false;
bool light = false;
bool safeMode = true;
int temperatureLimit = 35;
int lightLevelLimit = 30;

void setup() {
  Wire.begin();
  dht.begin();

  FastLED.addLeds<WS2812, LED_PIN>(leds, NUM_LEDS);

  pinMode(SCL, OUTPUT);
  pinMode(SDO, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  ledFullColor(white);
  startServer();

}

void loop() {

  readKeypad(pressedKey);
  keyFunctions(pressedKey);

  readDHT(temperature, humidity);
  readLDR(lightLevel);

  checkLimits(temperatureLimit, lightLevelLimit);

  showFullStatus();

  delay(500);
}

void setHeater(bool &heater, bool state) {
  heater = state;
}

void setLight(bool &light, bool state) {
    light = state;
}

void toggleHeater(bool &heater) {
  heater = !heater;
}

void toggleLight(bool &light) {
  light = !light;
}

void toggleSafeMode(bool &safeMode) {
  safeMode = !safeMode;
}

void startServer() {
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");

  setupRoutes();

  server.begin();
}

void setupRoutes() {
  server.on("/api/data", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<256> json;
    json["safeMode"] = safeMode;
    json["buzzer"] = buzzer;
    json["heater"] = heater;
    json["light"] = light;
    json["light Level"] = String(lightLevel) + " %";
    json["pressed Key"] = pressedKey;
    json["temperature"] = String(temperature) + " °C";
    json["humidity"] = String(humidity) + " %";

    String jsonResponse;
    serializeJson(json, jsonResponse);
    request->send(200, "application/json", jsonResponse);
  });

  server.on("/api/toggle/buzzer", HTTP_GET, [](AsyncWebServerRequest *request) {
    toggleBuzzer(buzzer);
    StaticJsonDocument<64> json;
    json["buzzer"] = buzzer;

    String jsonResponse;
    serializeJson(json, jsonResponse);
    request->send(200, "application/json", jsonResponse);
  });

  server.on("/api/toggle/heater", HTTP_GET, [](AsyncWebServerRequest *request) {
    toggleHeater(heater);
    StaticJsonDocument<64> json;
    json["heater"] = heater;

    String jsonResponse;
    serializeJson(json, jsonResponse);
    request->send(200, "application/json", jsonResponse);
  });

  server.on("/api/toggle/light", HTTP_GET, [](AsyncWebServerRequest *request) {
    toggleLight(light);
    StaticJsonDocument<64> json;
    json["light"] = light;

    String jsonResponse;
    serializeJson(json, jsonResponse);
    request->send(200, "application/json", jsonResponse);
  });

  server.on("/api/toggle/safe", HTTP_GET, [](AsyncWebServerRequest *request) {
    toggleSafeMode(safeMode);
    StaticJsonDocument<64> json;
    json["safe"] = safeMode;

    String jsonResponse;
    serializeJson(json, jsonResponse);
    request->send(200, "application/json", jsonResponse);
  });

}

void readDHT(float &temperature, float &humidity) {
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
}

void readLDR(int &lightLevel) {
  int ldrValue = analogRead(LDR_PIN);
  lightLevel = map(ldrValue, 0, 4095, 0, 100);
}

void readKeypad(int &pressedKey) {
  pressedKey = -1;
  for (int i = 1; i <= 16; i++) {
    digitalWrite(SCL, LOW);
    if (!digitalRead(SDO)) pressedKey = i - 8;
    digitalWrite(SCL, HIGH);
  }
}

void keyFunctions(int &pressedKey) {
  if (pressedKey != -1)

    if (!safeMode) {
      if (pressedKey == 1) toggleBuzzer(buzzer);
      else if (pressedKey == 2) toggleHeater(heater);
      else if (pressedKey == 3) toggleLight(light);
      else if (pressedKey == 8) toggleSafeMode(safeMode);
    }

    else if (pressedKey == 8) toggleSafeMode(safeMode);

    else alarm();

}

void toggleBuzzer(bool &buzzer) {
  buzzer = !buzzer;
  if (buzzer) tone(BUZZER_PIN, 2500);
  else noTone(BUZZER_PIN);
}

void showTemperature(float &temperature) {
  for(int i = 0; i <= temperature / 10; i++) {
    leds[i] = red;
    FastLED.show();
  }
}

void showSafeMode(bool &safeMode) {
  if (safeMode) leds[4] = green;
}

void showState(bool &state, int led, CRGB onColor, CRGB offColor) {
  if (state) leds[led] = onColor;
  else leds[led] = offColor;
  FastLED.show();
}

void ledFullColor(CRGB color) {
  for(int i = 0; i < NUM_LEDS; i++) {
    leds[i] = color;
    FastLED.show();
  }

  delay(500);

  for(int i = 0; i < NUM_LEDS; i++)
    leds[i] = turnOff;

  leds[4] = white;
  FastLED.show();
}

void showFullStatus() {
  showTemperature(temperature);
  showState(buzzer, 7, red, white);
  showState(heater, 6, maroon, blue);
  showState(light, 5, yellow, turnOff);
  showState(safeMode, 4, green, red);
}

void alarm() {
  toggleBuzzer(buzzer);
  ledFullColor(red);
  ledFullColor(blue);
  toggleBuzzer(buzzer);
}

void checkLimits(int &temperatureLimit, int &lightLevelLimit) {
  if (lightLevel < lightLevelLimit && !light) setLight(light, true);

  if (temperature < temperatureLimit && !heater) setHeater(heater, true);
}
