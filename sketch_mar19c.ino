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
CRGB turnOff = CRGB::Black;

float temperature, humidity;
int lightLevel, pressedKey;
bool buzzer = false;
bool heater = false;
bool light = false;
int temperatureLimit = 30;
int lightLevelLimit = 30;

void setup() {
  Wire.begin();
  Serial.begin(115200);
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

void startServer() {
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  
  Serial.print("ESP32 IP Address: ");
  Serial.println(IP);

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");

  setupRoutes();

  server.begin();
}

void setupRoutes() {
  server.on("/api/data", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<256> json;
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
    buzzerOn(buzzer);
    StaticJsonDocument<64> json;
    json["buzzer"] = buzzer;

    String jsonResponse;
    serializeJson(json, jsonResponse);
    request->send(200, "application/json", jsonResponse);
  });

  server.on("/api/toggle/heater", HTTP_GET, [](AsyncWebServerRequest *request) {
    heaterOn(heater);
    StaticJsonDocument<64> json;
    json["heater"] = heater;

    String jsonResponse;
    serializeJson(json, jsonResponse);
    request->send(200, "application/json", jsonResponse);
  });

  server.on("/api/toggle/light", HTTP_GET, [](AsyncWebServerRequest *request) {
    lightOn(light);
    StaticJsonDocument<64> json;
    json["light"] = light;

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
    if (pressedKey == 1) buzzerOn(buzzer);
    else if (pressedKey == 2) heaterOn(heater);
    else if (pressedKey == 3) lightOn(light);
    else alarm();
}

void buzzerOn(bool &buzzer) {
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

void showState(bool &state, int led) {
  if (state) leds[led] = red;
  else leds[led] = blue;
  FastLED.show();
}

void heaterOn(bool &heater) {
  heater = !heater;
  if (heater) ledFullColor(red);
  else ledFullColor(blue);
}

void lightOn(bool &light) {
  light = !light;
  if (light) ledFullColor(red);
  else ledFullColor(blue);
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
  showState(buzzer, 7);
  showState(heater, 6);
  showState(light, 5);
}

void alarm() {
  ledFullColor(red);
  ledFullColor(blue);
}

void checkLimits(int &temperatureLimit, int &lightLevelLimit) {
  if (lightLevel < lightLevelLimit && !light) lightOn(light);
  if (temperature < temperatureLimit && !heater) heaterOn(heater);
}