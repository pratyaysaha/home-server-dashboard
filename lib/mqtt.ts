import mqtt from "mqtt"

export function createMqttClient(url: string, options = {}) {
    return mqtt.connect(url, options)
}