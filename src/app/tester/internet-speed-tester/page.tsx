"use client";

import SpeedTracker from "./_components/speed-tracker";
import { Heading } from "@/components/heading";

export default function InternetSpeedTesterPage() {
    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <Heading 
                title="Internet Speed Tester"
                description="Test your internet upload and download speed."
            />
            <SpeedTracker />
        </div>
    );
}
