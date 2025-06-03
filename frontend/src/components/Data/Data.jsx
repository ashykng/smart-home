import { useEffect, useState } from 'react'
import axios from 'axios'
import { endpoints } from '../../../config'

import { GeneralCard } from '../general/Card/Card'

import { HiSpeakerWave } from "react-icons/hi2"
import { FaLightbulb, FaTemperatureHigh, FaUserLock } from "react-icons/fa"
import { FaKeyboard } from 'react-icons/fa6'
import { WiHumidity } from "react-icons/wi"
import { LuHeater } from "react-icons/lu"

export default function Data() {
    const [data, setData] = useState({})

    const cardConfig = {
        'safeMode': {
            toggleApi: endpoints.toggleSafeMode,
            icon: <FaUserLock className="w-6 h-6" />
        },
        'buzzer': {
            toggleApi: endpoints.toggleBuzzer,
            icon: <HiSpeakerWave className="text-gray-600 w-6 h-6" />
        },
        'light': {
            toggleApi: endpoints.toggleLight,
            icon: <FaLightbulb className="text-yellow-500 w-6 h-6" />
        },
        'heater': {
            toggleApi: endpoints.toggleHeater,
            icon: <LuHeater className="text-red-500 w-6 h-6" />
        },
        'light Level': {
            icon: <FaLightbulb className="text-blue-500 w-6 h-6" />
        },
        'temperature': {
            icon: <FaTemperatureHigh className="text-red-500 w-6 h-6" />
        },
        'pressed Key': {
            icon: <FaKeyboard className="text-blue-500 w-6 h-6" />
        },
        'humidity': {
            icon: <WiHumidity className="text-blue-500 w-7 h-7" />
        }
    }

    async function fetchData() {
        try {
            const response = await axios.get(endpoints.data)
            setData(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        const interval = setInterval(fetchData, 500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="px-4 py-6 max-w-screen-xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900">Ashkan Tavassoli</h1>
                <p className="text-lg text-gray-500">Smart Home Project</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data && Object.entries(data).map(([key, value]) => {
                    const config = cardConfig[key] || {}
                    return (
                        <GeneralCard
                            key={key}
                            title={key.toUpperCase()}
                            data={value}
                            toggleApi={config.toggleApi || null}
                            icon={config.icon || null}
                            safeMode={data.safeMode}
                        />

                    )
                })}
            </div>
            <br /><br /><br />
        </div>
    )
}
