import { CardDefault } from '../general/card/card'
import axios from 'axios'
import { endpoints } from '../../../config'
import { API_URL } from '../../../config'
import { useEffect, useState } from 'react'

import { HiSpeakerWave } from "react-icons/hi2"
import { FaLightbulb, FaTemperatureHigh } from "react-icons/fa"
import { FaKeyboard } from 'react-icons/fa6'
import { WiHumidity } from "react-icons/wi"
import { LuHeater } from "react-icons/lu"

export default function Data() {
    const [data, setData] = useState({})

    const cardConfig = {
        'buzzer': {
            toggleApi: `${API_URL}/toggle/buzzer`,
            icon: <HiSpeakerWave className="text-gray-600 w-5 h-5" />
        },
        'light': {
            toggleApi: `${API_URL}/toggle/light`,
            icon: <FaLightbulb className="text-yellow-500 w-5 h-5" />
        },
        'heater': {
            toggleApi: `${API_URL}/toggle/heater`,
            icon: <LuHeater className="text-red-500 w-5 h-5" />
        },
        'light Level': {
            icon: <FaLightbulb className="text-blue-500 w-5 h-5" />
        },
        'temperature': {
            icon: <FaTemperatureHigh className="text-red-500 w-5 h-5" />
        },
        'pressed Key': {
            icon: <FaKeyboard className="text-blue-500 w-5 h-5" />
        },
        'humidity': {
            icon: <WiHumidity className="text-blue-500 w-6 h-6" />
        }
    }

    async function fetchData() {
        try {
            const response = await axios.get(endpoints.data)
            setData(response.data)
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData()
        }, 500)

        return () => clearInterval(interval)
    }, [])

    return (
        <div style={{ display: "ruby" }}>
            {data && Object.entries(data).map(([key, value]) => {
                const config = cardConfig[key] || {}
                return (
                    <CardDefault
                        key={key}
                        title={key.toUpperCase()}
                        data={value}
                        toggleApi={config.toggleApi || null}
                        icon={config.icon || null}
                    />
                )
            })}
        </div>
    )
}