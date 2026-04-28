import mqtt from "mqtt"

export const remoteClient = mqtt.connect(
    process.env.NEXT_PUBLIC_AIO_URL!,
    {
        username: process.env.NEXT_PUBLIC_AIO_USERNAME,
        password: process.env.NEXT_PUBLIC_AIO_KEY,
        reconnectPeriod: 5000,
        connectTimeout: 10000,
        clean: true,
    }
)

// ✅ Connection logs
remoteClient.on("connect", () => {
    console.log("🌍 Adafruit MQTT connected")
})

remoteClient.on("reconnect", () => {
    console.log("🔄 Adafruit MQTT reconnecting...")
})

remoteClient.on("error", (err) => {
    console.error("❌ Adafruit MQTT error:", err.message)
})

remoteClient.on("offline", () => {
    console.warn("⚠️ Adafruit MQTT offline")
})