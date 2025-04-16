#include <Wire.h>
#include <WiFi.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>

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

float temperature, humidity;
int lightLevel, pressedKey, servoDegree;
bool buzzer = false;

void setup() {
  Wire.begin();
  Serial.begin(115200);
  dht.begin();

  pinMode(SCL, OUTPUT);
  pinMode(SDO, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  delay(1000);
  startServer();
}

void loop() {
  readKeypad(pressedKey);
  keyFunctions(pressedKey);

  readDHT(temperature, humidity);
  readLDR(lightLevel);

  soundBuzzer(buzzer);

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
    json["light Level"] = String(lightLevel) + " %";
    json["pressed Key"] = pressedKey;
    json["temperature"] = String(temperature) + " °C";
    json["humidity"] = String(humidity) + " %";

    String jsonResponse;
    serializeJson(json, jsonResponse);
    request->send(200, "application/json", jsonResponse);
  });

  server.on("/api/toggle", HTTP_GET, [](AsyncWebServerRequest *request) {
    buzzer = !buzzer;
    StaticJsonDocument<64> json;
    json["buzzer"] = buzzer;

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
  if (pressedKey == 1) buzzer = !buzzer;
}

void soundBuzzer(bool &buzzer) {
  if (buzzer) tone(BUZZER_PIN, 2500);
  else noTone(BUZZER_PIN);
}
