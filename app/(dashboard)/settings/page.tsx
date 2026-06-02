import { NotificationSettingsCard } from "@/components/settings/notification-settings-card";
import { PlexSettingsCard } from "@/components/settings/plex-settings-card";
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

            <SettingsSection
                title="Plex"
                description="Manage media library actions for your Plex server."
            >
                <PlexSettingsCard />
            </SettingsSection>
        </SettingsPageShell>
    );
}
