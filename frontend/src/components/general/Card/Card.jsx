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

export function CardDefault({ title, data, toggleApi, icon }) {
    return (
        <Card className="w-full max-w-sm shadow-xl rounded-2xl border border-gray-100 transition-transform hover:scale-[1.02] bg-white">
            <CardBody className="p-5">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                        {icon}
                    </div>
                    <Typography variant="h6" color="blue-gray" className="font-semibold">
                        {title}
                    </Typography>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <Typography color="gray" className="text-base font-medium">
                        {typeof data === 'boolean' ? (data ? 'ON' : 'OFF') : data}
                    </Typography>

                    {typeof data === 'boolean' && toggleApi && (
                        <button
                            onClick={() => toggle(toggleApi)}
                            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                        >
                            Toggle
                        </button>
                    )}
                </div>
            </CardBody>
        </Card>
    )
}
