import mqtt from "mqtt"

export const localClient = mqtt.connect(
    process.env.NEXT_PUBLIC_MQTT_LOCAL_URL!,
    {
        username: process.env.NEXT_PUBLIC_MQTT_USER,
        password: process.env.NEXT_PUBLIC_MQTT_PASS,
        reconnectPeriod: 2000,
    }
)

localClient.on("connect", () => {
    console.log("✅ Local MQTT connected")
})

localClient.on("error", (err) => {
    console.error("Local MQTT error", err)
})