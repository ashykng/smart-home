import { Card, CardBody, Typography } from "@material-tailwind/react"
import axios from 'axios'

async function toggle(toggleApi) {
    try {
        const response = await axios.get(toggleApi)
        console.log(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

export function CardDefault({
    title,
    data,
    toggleApi,
    icon
}) {
    return (
        <Card className="mx-4 mt-6 w-80 shadow-lg rounded-2xl border border-gray-200">
            <CardBody className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    {icon && (
                        <div className="flex items-center pr-4 border-r border-gray-300">
                            {icon}
                        </div>
                    )}

                    <Typography variant="h5" color="blue-gray" className="font-semibold">
                        {title}
                    </Typography>

                    {typeof data === "boolean" ? (
                        <button
                            type="button"
                            onClick={() => toggle(toggleApi)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition cursor-pointer"
                        >
                            {data.toString()} | Toggle
                        </button>
                    ) : (
                        <Typography color="gray" className="text-sm font-medium">
                            {data}
                        </Typography>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
