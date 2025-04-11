import { CardDefault } from '../general/card/card'
import axios from 'axios'
import { endpoints } from '../../../config'
import { useEffect, useState } from 'react'

export default function Data() {
    const [data, setData] = useState({})

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
    }, []);

    return (
        <div className='p-2'>
            {data && Object.entries(data).map(([key, value]) => (
                <CardDefault
                    key={key}
                    title={key.toUpperCase()}
                    data={value}
                    toggleApi={key == "buzzer" ? "test" : null}
                />
            ))}
        </div>
    );
}
