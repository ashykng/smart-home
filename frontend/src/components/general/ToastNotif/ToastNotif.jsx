import { useEffect, useState } from "react"
import { FaCheckCircle } from "react-icons/fa"

export function GeneralToastNotif({ message, onClose }) {
    const [visible, setVisible] = useState(true)
    const displayDuration = 500
    const fadeDuration = 200

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)

            setTimeout(() => {
                onClose?.()
            }, fadeDuration)
        }, displayDuration)

        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div
                className={`flex items-center w-full max-w-sm py-4 px-5 text-gray-700 bg-white rounded-xl border border-gray-200 shadow-md transition-opacity duration-300 ${
                    visible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                role="alert"
            >
                <div className="inline-flex space-x-3 items-center">
                    <span className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <FaCheckCircle className="w-6 h-6 text-green-600" />
                    </span>
                    <p className="text-sm font-medium">{message} changed successfully</p>
                </div>
            </div>
        </div>
    );
}
