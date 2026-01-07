#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>

const char* ssid = "Boy_doc_than";
const char* password = "duchuy2004";

const char* mqtt_server = "34.44.49.190"; 
const int mqtt_port = 31883;
const char* mqtt_user = "admin";
const char* mqtt_pass = "admin123";

// --- TOPIC ---
const char* topic_telemetry = "sensor_data"; // Gửi dữ liệu đi
const char* topic_command = "control.commands.esp32-27";        // Nhận lệnh về

// --- CẤU HÌNH PHẦN CỨNG ---
#define DHTPIN 4
#define DHTTYPE DHT22

#define LED_PUMP_PIN 2   // Đèn báo trạng thái bơm 
#define RELAY_PIN 23     // Chân kích Relay
#define SOIL_PIN 36      // Cảm biến đất (Analog In)
#define LIGHT_PIN 39     // Cảm biến ánh sáng (Analog In)

// Mức kích Relay
#define RELAY_ON LOW 
#define RELAY_OFF HIGH

// --- NGƯỠNG TỰ ĐỘNG ---
const int DRY_THRESHOLD = 40; // < 40% -> Bơm
const int WET_THRESHOLD = 60; // > 60% -> Ngắt

// --- BIẾN TOÀN CỤC ---
DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

// Trạng thái hệ thống
bool pumpState = false;
int soilPercent = 0;
int lightPercent = 0;

// Chế độ hoạt động: true = Tự động theo đất, false = Thủ công qua MQTT
bool isAutoMode = true; 

void callback(char* topic, byte* payload, unsigned int length);
void reconnect();

void setup() {
  Serial.begin(115200);

  // 1. Cấu hình chân
  pinMode(LED_PUMP_PIN, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(SOIL_PIN, INPUT);
  pinMode(LIGHT_PIN, INPUT);

  // Trạng thái ban đầu
  digitalWrite(RELAY_PIN, RELAY_OFF);
  digitalWrite(LED_PUMP_PIN, LOW);

  dht.begin();

  // 2. Kết nối WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Dang ket noi WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi Connected");

  // 3. Cấu hình MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback); // Đăng ký hàm nhận dữ liệu
  
  // 4. Tạo Task xử lý chính
  xTaskCreate(TaskSystemHandler, "System Task", 8192, NULL, 1, NULL);
}

void loop() {
  vTaskDelay(1000 / portTICK_PERIOD_MS);
}

// ================= HÀM XỬ LÝ NHẬN LỆNH (CALLBACK) =================
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Nhan lenh tu topic [");
  Serial.print(topic);
  Serial.print("]: ");

  // 1. Convert payload sang String
  char msg[length + 1];
  memcpy(msg, payload, length);
  msg[length] = '\0';
  Serial.println(msg);

  // 2. Parse JSON
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, msg);

  if (error) {
    Serial.print("Loi JSON: ");
    Serial.println(error.c_str());
    return;
  }

  // 3. Xử lý lệnh
  // Cấu trúc lệnh: { "pump": "ON" } hoặc { "pump": "OFF" } hoặc { "pump": "AUTO" }
  
  // A. Chuyển chế độ về TỰ ĐỘNG
  if (doc.containsKey("pump") && doc["pump"] == "AUTO") {
    isAutoMode = true;
    Serial.println("-> Da chuyen sang che do TU DONG (Auto).");
  }
  
  // B. Điều khiển Bơm (Sẽ tự chuyển sang chế độ THỦ CÔNG)
  if (doc.containsKey("pump")) {
    const char* cmd = doc["pump"];

    if (strcmp(cmd, "ON") == 0) {
      pumpState = true;
      isAutoMode = false;
      digitalWrite(RELAY_PIN, RELAY_ON);
      digitalWrite(LED_PUMP_PIN, HIGH);
      Serial.println("-> Phat hien lenh thu cong -> Chuyen sang MANUAL mode.");
      Serial.println("-> Lenh: BAT BOM");
    } else if (strcmp(cmd, "OFF") == 0) {
      pumpState = false;
      isAutoMode = false;
      digitalWrite(RELAY_PIN, RELAY_OFF);
      digitalWrite(LED_PUMP_PIN, LOW);
      Serial.println("-> Phat hien lenh thu cong -> Chuyen sang MANUAL mode.");
      Serial.println("-> Lenh: TAT BOM");
    }
  }
}

// ================= TASK XỬ LÝ CHÍNH =================
void TaskSystemHandler(void *pvParameters) {
  unsigned long lastTelemetryTime = 0;

  for (;;) {
    // A. DUY TRÌ KẾT NỐI MQTT
    if (WiFi.status() == WL_CONNECTED) {
      if (!client.connected()) {
        Serial.print("Phải kết nối lại...");
        reconnect();
      }
      client.loop(); 
    }

    // B. ĐỌC CẢM BIẾN (Thực hiện mỗi 1 giây)
    static unsigned long lastCheckTime = 0;
    unsigned long now = millis();

    if (now - lastCheckTime > 1000) {
      lastCheckTime = now;

      // --- 1. Đọc độ ẩm đất ---
      int analogSoil = analogRead(SOIL_PIN);
      soilPercent = map(analogSoil, 3500, 1500, 0, 100);
      soilPercent = constrain(soilPercent, 0, 100);

      // --- 2. Đọc ánh sáng ---
      int analogLight = analogRead(LIGHT_PIN);
      // Giả sử: Giá trị càng cao càng sáng
      lightPercent = map(analogLight, 0, 4095, 0, 100); 

      // --- 3. Logic điều khiển bơm ---
      if (isAutoMode) {
        if (soilPercent < DRY_THRESHOLD && !pumpState) {
          Serial.println("[AUTO] Dat kho -> BAT BOM");
          pumpState = true;
          digitalWrite(RELAY_PIN, RELAY_ON);
          digitalWrite(LED_PUMP_PIN, HIGH);
        } 
        else if (soilPercent > WET_THRESHOLD && pumpState) {
          Serial.println("[AUTO] Dat am -> TAT BOM");
          pumpState = false;
          digitalWrite(RELAY_PIN, RELAY_OFF);
          digitalWrite(LED_PUMP_PIN, LOW);
        }
      }
    }

    // C. GỬI DỮ LIỆU LÊN RABBITMQ (Mỗi 3 giây)
    if (now - lastTelemetryTime > 3000) {
      lastTelemetryTime = now;

      float h = dht.readHumidity();
      float t = dht.readTemperature();

      if (client.connected()) {
        JsonDocument doc;
        doc["sensorId"] = "esp32-27";
        doc["temperature"] = isnan(t) ? 0 : t;
        doc["humidity"] = isnan(h) ? 0 : h;
        doc["soil_moisture"] = soilPercent;
        doc["light_level"] = lightPercent;  
        doc["pump_state"] = pumpState ? "ON" : "OFF";
        doc["mode"] = isAutoMode ? "AUTO" : "MANUAL";
        doc["status"] = "ONLINE";
        char buffer[512];
        serializeJson(doc, buffer);

        client.publish(topic_telemetry, buffer, true); 
        Serial.println("Da gui telemetry (ONLINE).");
      }
    }

    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}

// ================= HÀM KẾT NỐI LẠI  =================
void reconnect() {
  if (WiFi.status() != WL_CONNECTED) return;

  if (!client.connected()) {
    Serial.print("Dang ket noi MQTT (LWT Mode)...");

    String clientId = "ESP32-" + String(random(0xffff), HEX);
    const char* msg_lwt = "{\"sensorId\":\"esp32-27\",\"temperature\":null,\"humidity\":null,\"soil_moisture\":null,\"light_level\":null,\"pump_state\":null,\"mode\":null,\"status\":\"OFFLINE\"}";
    const char* msg_online_init = "{\"sensorId\":\"esp32-27\",\"temperature\":null,\"humidity\":null,\"soil_moisture\":null,\"light_level\":null,\"pump_state\":null,\"mode\":null,\"status\":\"ONLINE\"}";

    
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass, 
                       topic_telemetry, 1, true, msg_lwt)) {
      
      Serial.println("Thanh cong!");
      client.publish(topic_telemetry, msg_online_init, true);
      Serial.println("-> Da gui tin hieu ONLINE ngay lap tuc.");

      if (client.subscribe(topic_command)) {
        Serial.print("-> Da subscribe topic: ");
        Serial.println(topic_command);
      } else {
        Serial.println("-> Subscribe THAT BAI!");
      }

    } else {
      Serial.print("That bai, rc=");
      Serial.print(client.state());
    }
  }
}