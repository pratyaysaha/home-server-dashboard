import type { ReactNode } from "react";

type SettingsPageShellProps = {
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
};

type SettingsSectionProps = {
    title: string;
    description: string;
    children: ReactNode;
};

export function SettingsPageShell({
    eyebrow,
    title,
    description,
    children,
}: SettingsPageShellProps) {
    return (
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    {eyebrow}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {children}
        </section>
    );
}

export function SettingsSection({
    title,
    description,
    children,
}: SettingsSectionProps) {
    return (
        <section className="space-y-4">
            <div className="space-y-1">
                <h3 className="text-base font-medium tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {children}
        </section>
    );
}
