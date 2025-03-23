import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import Rainfall from './Rainfall';

function App() {
  const [data, setData] = useState(
    {
      pressure: "",
      maxtemp: "",
      dewpoint: "",
      humidity: "",
      cloud: "",
      sunshine: "",
      winddirection: "",
      windspeed: "",
  
    }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [answer, setAnswer] = useState("")
  useEffect(() => {
    const controller = new AbortController();
    ; (async () => {
      try {
        //bring 2 data from server which was sent by sensor

        const resSensor = await axios.get('https://sensor-backend-a2mn.onrender.com/data');
        const dataSensor = resSensor.data;
        console.log(dataSensor);
        data.maxtemp = dataSensor.maxtemp;
        data.pressure = dataSensor.pressure;

        const numericData = {
          pressure: parseFloat(data.pressure) || 0,
          maxtemp: parseFloat(data.maxtemp) || 0,
          dewpoint: parseFloat(data.dewpoint) || 0,
          humidity: parseFloat(data.humidity) || 0,
          cloud: parseFloat(data.cloud) || 0,
          sunshine: parseFloat(data.sunshine) || 0,
          winddirection: parseFloat(data.winddirection) || 0,
          windspeed: parseFloat(data.windspeed) || 0,
        };
        
        // const response = await axios.post('http://localhost:5000/predict', numericData, {
        //   signal: controller.signal,
        // });
        const response = await axios.post('https://rainfallapi.onrender.com/predict', numericData, {
          signal: controller.signal,
        });
        console.log(response.data);
        // setAnswer({"prediction result": "no rainfall"})
        setAnswer(response.data);
        setLoading(false);
      } catch (error) {
        if(axios.isCancel(error)){
          console.log('Request canceled', error.message);
          return;
        }

        setError(true)
        setLoading(false);
      }
    })()

    return () => {
      controller.abort();
    }
  }, [data])
  return (
    //rainfall part of suggestion
    <div className={`min-h-screen py-12 px-6 relative overflow-hidden ${
      answer && answer["prediction result"] === "rainfall" 
        ? "bg-linear-to-r from-blue-200 to-blue-400" 
        : "bg-radial-[at_50%_75%] from-white to-orange-400 to-75%"
    }`}>
      {answer && answer["prediction result"] === "rainfall" && <Rainfall />}
      
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Weather Prediction Model 🌦️☔</h1>
        
        {loading && <div className="text-center text-lg text-blue-600 mb-4">Loading prediction...</div>}
        {error && <div className="text-center text-lg text-red-600 mb-4">Something went wrong</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pressure</label>
            <div className="flex items-start w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <span>{`Sensor Data : ${data.pressure} hPa`}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Max Temperature</label>
            <div className="flex items-start w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <span>{`Sensor Data : ${data.maxtemp} °C`}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Dew Point</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter dew point"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.dewpoint}
              onChange={(e) => setData({...data, dewpoint: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Humidity</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter humidity"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.humidity}
              onChange={(e) => setData({...data, humidity: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cloud Cover</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter cloud cover"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.cloud}
              onChange={(e) => setData({...data, cloud: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sunshine</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter sunshine"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.sunshine}
              onChange={(e) => setData({...data, sunshine: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Wind Direction</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter wind direction"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.winddirection}
              onChange={(e) => setData({...data, winddirection: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Wind Speed</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter wind speed"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.windspeed}
              onChange={(e) => setData({...data, windspeed: e.target.value})}
            />
          </div>
        </div>

        {answer && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-center text-blue-900">
              Prediction: <span className="text-blue-600">{answer["prediction result"]}</span>
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
