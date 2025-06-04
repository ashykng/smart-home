import { useState } from "react";

export function GeneralSlider() {
    const [value, setValue] = useState(50);

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <label htmlFor="slider" className="block text-sm font-medium text-gray-700 mb-2">
                Value: <span className="font-bold text-blue-600">{value}</span>
            </label>
            <input
                id="slider"
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
        </div>
    )
}