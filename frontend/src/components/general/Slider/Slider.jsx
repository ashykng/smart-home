import { useState } from "react"
import { Typography } from "@material-tailwind/react"
import axios from "axios"

export function GeneralSlider({ icon, title, data, submitApi }) {
    const [value, setValue] = useState(data)

    const submit = async () => {
        try {
            const response = await axios.get(`${submitApi}?limit=${value}`);
            console.log(response.data);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full shadow">
                    {icon}
                </div>
                <Typography variant="h5" color="blue-gray" className="font-semibold">
                    {title}
                </Typography>
            </div>

            <div className="flex justify-between items-center">
                <label htmlFor="slider" className="text-sm font-medium text-gray-700">
                    Limit Value
                </label>
                <span className="text-blue-600 font-bold">{value}</span>
            </div>

            <input
                id="slider"
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <button
                onClick={submit}
                className="cursor-pointer w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-shadow shadow-md"
            >
                Submit
            </button>
        </div>
    )
}