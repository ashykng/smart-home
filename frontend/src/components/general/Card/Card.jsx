import { Card, CardBody, Typography } from "@material-tailwind/react"
import axios from 'axios'

async function toggle(toggleApi) {
    try {
        const response = await axios.get(toggleApi)
        console.log(response.data)
    } catch (error) {
        console.error('Error toggling data:', error)
    }
}

export function GeneralCard({ title, data, toggleApi, icon, automaticMode }) {
    const isAutomaticModeCard = title.toLowerCase() === 'automatic mode'
    const canToggle = isAutomaticModeCard || !automaticMode
    const isOn = data === true

    return (
        <Card className="w-full max-w-sm shadow-lg rounded-2xl border border-gray-200 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
            <CardBody className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-full shadow-sm">
                        {icon}
                    </div>
                    <Typography variant="h6" color="blue-gray" className="font-semibold text-lg">
                        {title}
                    </Typography>
                </div>

                <div className="flex items-center justify-between mt-4">
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
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition duration-200 ${
                                canToggle
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Toggle
                        </button>
                    )}
                </div>
            </CardBody>
        </Card>
    )
}
