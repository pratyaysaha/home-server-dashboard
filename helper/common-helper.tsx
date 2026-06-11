import { ReactNode } from "react";
import {
    FaLinkedin,
    FaRedditAlien,
    FaFacebook,
    FaInstagram,
} from "react-icons/fa";

import { SiX } from "react-icons/si";
import { Globe } from "lucide-react";

export function getPlatformIcon(
    platform: string
): ReactNode {
    switch (platform.toLowerCase()) {
        case "linkedin":
            return (
                <FaLinkedin className="h-5 w-5 text-[#0A66C2]" />
            );

        case "reddit":
            return (
                <FaRedditAlien className="h-5 w-5 text-[#FF4500]" />
            );

        case "twitter":
        case "x":
            return (
                <SiX className="h-5 w-5" />
            );

        case "facebook":
            return (
                <FaFacebook className="h-5 w-5 text-[#1877F2]" />
            );

        case "instagram":
            return (
                <FaInstagram className="h-5 w-5" />
            );

        default:
            return (
                <Globe className="h-5 w-5" />
            );
    }
}

export function formatDaysAgo(dateString: string) {
    const createdAt = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - createdAt.getTime();

    const diffDays = Math.floor(
        diffMs / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
        return "Today";
    }

    if (diffDays === 1) {
        return "1 day ago";
    }

    return `${diffDays} days ago`;
}