"use client";

import { useState } from "react";


export default function MouseTracker() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clicks, setClicks] = useState({ left: "Released", right: "Released" });
    const [scroll, setScroll] = useState("None");

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) setClicks((prev) => ({ ...prev, left: "Pressed" }));
        if (e.button === 2) setClicks((prev) => ({ ...prev, right: "Pressed" }));
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (e.button === 0) setClicks((prev) => ({ ...prev, left: "Released" }));
        if (e.button === 2) setClicks((prev) => ({ ...prev, right: "Released" }));
    };

    const handleScroll = (e: React.WheelEvent) => {
        setScroll(e.deltaY < 0 ? "Up" : "Down");
        setTimeout(() => setScroll("None"), 500);
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 space-y-6"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onWheel={handleScroll}
            onContextMenu={(e) => e.preventDefault()}
        >

            {/* Mouse UI */}
<div className="relative w-60 h-90 bg-gray-700 rounded-lg flex flex-col items-center justify-center shadow-lg p-6">
    <div className="w-24 h-36 bg-gray-100 rounded-md flex flex-col items-center relative shadow-md border border-gray-400">
        {/* Scroll Wheel */}
        <div
            className={`w-8 h-14 bg-gray-500 rounded-t-md ${
                scroll !== "None" ? "animate-bounce" : ""
            }`}
        ></div>

        {/* Left Click */}
        <div
            className={`absolute top-3 left-2 w-8 h-14 rounded-md transition-all ${
                clicks.left === "Pressed" ? "bg-red-500 scale-110" : "bg-gray-300 hover:bg-red-400"
            }`}
        ></div>

        {/* Right Click */}
        <div
            className={`absolute top-3 right-2 w-8 h-14 rounded-md transition-all ${
                clicks.right === "Pressed" ? "bg-blue-500 scale-110" : "bg-gray-300 hover:bg-blue-400"
            }`}
        ></div>

        <div className="w-full h-20 bg-black rounded-b-md shadow-inner"></div>
    </div>
</div>


            {/* Event Table */}
            <div className="w-[400px] bg-gray-800 p-4 rounded-lg shadow-md">

                <h2 className="text-white text-sm mb-2">Mouse Event Logs</h2>
                <table className="w-[371px] text-white text-sm border border-gray-600">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="border border-gray-600 p-2">Event</th>
                            <th className="border border-gray-600 p-2">Parameters</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-gray-900 hover:bg-gray-700">
                            <td className="border border-gray-600 p-2">Mouse Move</td>
                            <td className="border border-gray-600 p-2">{`X: ${position.x}, Y: ${position.y}`}</td>
                        </tr>
                        <tr className="bg-gray-900 hover:bg-gray-700">
                            <td className="border border-gray-600 p-2">Click</td>
                            <td className="border border-gray-600 p-2">{`Left: ${clicks.left}, Right: ${clicks.right}`}</td>
                        </tr>
                        <tr className="bg-gray-900 hover:bg-gray-700">
                            <td className="border border-gray-600 p-2">Scroll</td>
                            <td className="border border-gray-600 p-2">{scroll}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
              
        </div>
    );
}
