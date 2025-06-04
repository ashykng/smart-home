export const API_URL = "http://192.168.4.1/api"

export const endpoints = {
    data: `${API_URL}/data`,
    toggleAutomaticMode: `${API_URL}/toggle/automatic`,
    toggleBuzzer: `${API_URL}/toggle/buzzer`,
    toggleLight: `${API_URL}/toggle/light`,
    toggleHeater: `${API_URL}/toggle/heater`,
    changeLightLevelLimit: `${API_URL}/change/light`,
    changeTemperatureLimit: `${API_URL}/change/temp`
}