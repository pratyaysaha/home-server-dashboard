import { NotificationSettingsCard } from "@/components/settings/notification-settings-card";
import {
    SettingsPageShell,
    SettingsSection,
} from "@/components/settings/settings-shell";

export default function SettingsPage() {
    return (
        <SettingsPageShell
            eyebrow="Preferences"
            title="Settings"
            description="Keep device-level preferences organized in one place."
        >
            <SettingsSection
                title="Notifications"
                description="Control how this device receives browser alerts."
            >
                <NotificationSettingsCard />
            </SettingsSection>
        </SettingsPageShell>
    );
}
