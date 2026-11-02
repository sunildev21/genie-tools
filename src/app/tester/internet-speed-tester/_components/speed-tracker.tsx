"use client";

import { useState } from "react";

export default function SpeedTracker() {
    const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
    const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
    const [ping, setPing] = useState<number | null>(null);
    const [testing, setTesting] = useState(false);

    // Function to measure download speed
    const measureDownloadSpeed = async () => {
        const fileSizeInBits = 5 * 1024 * 1024 * 8; // 5 MB file
        const startTime = performance.now();
        await fetch("http://ipv4.download.thinkbroadband.com/5MB.zip"); // Test file
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // Convert ms to seconds
        return (fileSizeInBits / (duration * 1024 * 1024)).toFixed(2);
    };

    // Function to measure upload speed (Mocked)
    const measureUploadSpeed = async () => {
        const startTime = performance.now();
        await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify({ data: "test" }),
            headers: { "Content-Type": "application/json" },
        });
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        return (1 / duration).toFixed(2); // Mocked 1 MB upload
    };

    // Function to measure ping
    const measurePing = async () => {
        const startTime = performance.now();
        await fetch("https://www.google.com", { mode: "no-cors" });
        const endTime = performance.now();
        return (endTime - startTime).toFixed(2);
    };

    const startTest = async () => {
        setTesting(true);
        setDownloadSpeed(null);
        setUploadSpeed(null);
        setPing(null);

        const download = await measureDownloadSpeed();
        const upload = await measureUploadSpeed();
        const pingTime = await measurePing();

        setDownloadSpeed(parseFloat(download));
        setUploadSpeed(parseFloat(upload));
        setPing(parseFloat(pingTime));
        setTesting(false);
    };

    return (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md text-white text-center">
            <button
                onClick={startTest}
                disabled={testing}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
                {testing ? "Testing..." : "Start Speed Test"}
            </button>

            <div className="mt-4">
                <p>📥 Download Speed: {downloadSpeed ? `${downloadSpeed} Mbps` : "—"}</p>
                <p>📤 Upload Speed: {uploadSpeed ? `${uploadSpeed} Mbps` : "—"}</p>
                <p>📡 Ping: {ping ? `${ping} ms` : "—"}</p>
            </div>
        </div>
    );
}
