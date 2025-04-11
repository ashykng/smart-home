import { Card, CardBody, Typography } from "@material-tailwind/react";

export function CardDefault({
    title,
    data,
    toggleApi
}) {
    return (
        <Card className="mt-6 w-80 shadow-lg rounded-2xl border border-gray-200">
            <CardBody className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Typography variant="h5" color="blue-gray" className="font-semibold">
                        {title}
                    </Typography>

                    {typeof data === "boolean" ? (
                        <button
                            type="button"
                            onClick={toggleApi}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition cursor-pointer"
                        >
                            Toggle
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
