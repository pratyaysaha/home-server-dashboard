"use client";

import mermaid from "mermaid";
import { useEffect, useRef } from "react";

export function MermaidRenderer({
    chart,
}: {
    chart: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
        });

        if (ref.current) {
            mermaid
                .render(
                    `mermaid-${Date.now()}`,
                    chart
                )
                .then(({ svg }) => {
                    if (ref.current) {
                        ref.current.innerHTML = svg;
                    }
                });
        }
    }, [chart]);

    return <div ref={ref} />;
}