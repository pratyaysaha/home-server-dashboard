import { create } from "zustand"

type ActionType = "reboot" | "shutdown" | "start" | null

type State = {
    // 🔌 system state
    isOnline: boolean
    uptime: number

    // ⚙️ action state
    action: ActionType
    initialState: boolean | null
    wentOffline: boolean

    // setters
    setOnline: (v: boolean) => void
    setUptime: (v: number) => void

    // actions
    startAction: (type: ActionType, current: boolean) => void
    clearAction: () => void
}

export const useSystemStore = create<State>((set, get) => ({
    // -------------------------
    // SYSTEM STATE
    // -------------------------
    isOnline: false,
    uptime: 0,

    setOnline: (v) => {
        const { action, initialState, wentOffline } = get()

        set({ isOnline: v })

        // 🚫 no action running
        if (!action) return

        console.log("Watcher:", {
            action,
            initialState,
            wentOffline,
            now: v,
        })

        // 🔴 SHUTDOWN → online → offline
        if (action === "shutdown") {
            if (initialState === true && v === false) {
                console.log("✅ Shutdown complete")
                set({
                    action: null,
                    initialState: null,
                    wentOffline: false,
                })
            }
        }

        // 🟢 START → offline → online
        if (action === "start") {
            if (initialState === false && v === true) {
                console.log("✅ Start complete")
                set({
                    action: null,
                    initialState: null,
                    wentOffline: false,
                })
            }
        }

        // 🔵 REBOOT → online → offline → online
        if (action === "reboot") {
            // step 1 → went offline
            if (v === false && !wentOffline) {
                console.log("⚡ Reboot step 1 (offline)")
                set({ wentOffline: true })
                return
            }

            // step 2 → back online
            if (wentOffline && v === true) {
                console.log("✅ Reboot complete")
                set({
                    action: null,
                    initialState: null,
                    wentOffline: false,
                })
            }
        }
    },

    setUptime: (v) => set({ uptime: v }),

    // -------------------------
    // ACTION STATE
    // -------------------------
    action: null,
    initialState: null,
    wentOffline: false,

    startAction: (type, current) => {
        console.log("🚀 Action started:", type, "initial:", current)

        set({
            action: type,
            initialState: current,
            wentOffline: false,
        })

        // ⏱ FAIL-SAFE TIMEOUT (5 min)
        setTimeout(() => {
            const { action } = get()

            if (action) {
                console.warn("⚠️ Action timeout — manual check needed")

                set({
                    action: null,
                    initialState: null,
                    wentOffline: false,
                })
            }
        }, 5 * 60 * 1000)
    },

    clearAction: () =>
        set({
            action: null,
            initialState: null,
            wentOffline: false,
        }),
}))