import { useState } from "react"
import { Card, CardBody, Typography } from "@material-tailwind/react"
import axios from 'axios'

import { GeneralToastNotif } from '../ToastNotif/ToastNotif'

export function GeneralCard({ title, data, toggleApi, icon, automaticMode }) {
    const [showToast, setShowToast] = useState(false)
    const isAutomaticModeCard = title.toLowerCase() === 'automatic mode'
    const canToggle = isAutomaticModeCard || !automaticMode
    const isOn = data === true

    async function toggle(toggleApi) {
    try {
        const response = await axios.get(toggleApi)
        console.log(response.data)
        setShowToast(true)
    } catch (error) {
        console.error('Error toggling data:', error)
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
            <Card className="w-full max-w-sm shadow-lg rounded-2xl border border-gray-200 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
                <CardBody className="p-6 w-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gray-100 rounded-full shadow-sm">
                            {icon}
                        </div>
                        <Typography variant="h6" color="blue-gray" className="font-semibold text-lg">
                            {title}
                        </Typography>
                    </div>

                    <div className="flex items-center justify-around mt-4">
                        <div className="flex items-center gap-2">
                            {typeof data === 'boolean' && (
                                <span
                                    className={`w-3 h-3 rounded-full ${
                                        isOn ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                />
                            )}
                            <Typography color="gray" className="text-base font-medium">
                                {typeof data === 'boolean' ? (isOn ? 'ON' : 'OFF') : data}
                            </Typography>
                        </div>

                        {typeof data === 'boolean' && toggleApi && (
                            <button
                                onClick={() => canToggle && toggle(toggleApi)}
                                disabled={!canToggle}
                                className={`inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                    ${
                                        canToggle
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md cursor-pointer '
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Toggle
                            </button>
                        )}
                    </div>
                </CardBody>
            </Card>
        </>
    )
}
