import { useState } from "react"
import { Typography } from "@material-tailwind/react"
import axios from "axios"

import { GeneralToastNotif } from '../ToastNotif/ToastNotif'

export function GeneralSlider({ icon, title, data, submitApi }) {
    const [showToast, setShowToast] = useState(false)
    const [value, setValue] = useState(data)

    const submit = async () => {
        try {
            const response = await axios.get(`${submitApi}?limit=${value}`)
            console.log(response.data)
            setShowToast(true)
        } catch (error) {
            console.error("Error submitting data:", error)
        }
    }

    return (
        <>
            {showToast && (
                <GeneralToastNotif
                    message={title}
                    onClose={() => setShowToast(false)}
                />
            )}
            <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl border border-gray-200 shadow-md space-y-6 hover:shadow-2xl transition duration-300 ease-in-out">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-full shadow">
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
        </>
    )
}