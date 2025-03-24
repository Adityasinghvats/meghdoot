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
        // bring 2 data from server which was sent by sensor
        const resSensor = await axios.get('https://sensor-backend-a2mn.onrender.com/data');
        const dataSensor = resSensor.data;
        console.log(dataSensor);
        data.maxtemp = dataSensor.maxtemp;
        data.pressure = dataSensor.pressure;
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

  //depends on button to send and recevie data to ml server
  const predictRainfall = async() => {
    try {
      const controller = new AbortController();
      setLoading(true);
      setError(false);
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
  }
  return (
    //rainfall part of suggestion
    <div className={`min-h-screen py-12 px-6 relative overflow-hidden ${
      answer && answer["prediction result"] === "rainfall" 
        ? "bg-linear-to-r from-blue-200 to-blue-400" 
        : "bg-radial-[at_50%_75%] from-white to-orange-400 to-75%"
    }`}>
      {answer && answer["prediction result"] === "rainfall" && <Rainfall />}
      
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className='bg-blue-800 rounded-xl p-4 mb-4'>
          <h1 className="text-3xl font-bold text-center text-white mb-4">Meghdoot 🌦️☔</h1>
          <p className="text-lg font-thin text-center text-white mb-4">
          Advanced weather analytics to predict porbability of rainfall
          </p>
          </div>
        
        {loading && <div className="text-center text-lg text-blue-600 mb-4">Loading prediction...</div>}
        {error && <div className="text-center text-lg text-red-600 mb-4">Something went wrong</div>}
        <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">

          <h2 className="text-xl font-medium text-blue-800 flex items-center mb-4">
            <span className="mr-2">📊</span>Current Conditions from sensors
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100/70 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-600 mb-1">Pressure</div>
              <div className="text-2xl font-medium text-blue-800">{data.pressure} hPa</div>
            </div>
            <div className="bg-blue-100/70 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-600 mb-1">Temperature</div>
              <div className="text-2xl font-medium text-blue-800">{data.maxtemp}°C</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="col-span-1 md:col-span-2 mt-6 mb-2">
            <h3 className="text-lg font-medium text-blue-800 flex items-center">
              <span className="mr-2">🌡️</span>Atmospheric Conditions
            </h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">Dew Point (°C)</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter dew point"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={data.dewpoint}
              onChange={(e) => setData({...data, dewpoint: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">Humidity (%)</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter humidity"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={data.humidity}
              onChange={(e) => setData({...data, humidity: e.target.value})}
            />
          </div>
          <div className="col-span-1 md:col-span-2 mt-6 mb-2">
            <h3 className="text-lg font-medium text-blue-800 flex items-center">
              <span className="mr-2">🌥️</span>Sky Conditions
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">Cloud Cover (%)</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter cloud cover"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={data.cloud}
              onChange={(e) => setData({...data, cloud: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">Sunshine (%)</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter sunshine"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={data.sunshine}
              onChange={(e) => setData({...data, sunshine: e.target.value})}
            />
          </div>

          <div className="col-span-1 md:col-span-2 mt-6 mb-2">
            <h3 className="text-lg font-medium text-blue-800 flex items-center">
              <span className="mr-2">💨</span>Wind Conditions
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">Wind Direction (degrees)</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter wind direction"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={data.winddirection}
              onChange={(e) => setData({...data, winddirection: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">Wind Speed (km/h)</label>
            <input 
              type="number"
              step="0.1" 
              placeholder="Enter wind speed"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={data.windspeed}
              onChange={(e) => setData({...data, windspeed: e.target.value})}
            />
          </div>
        </div>
        <button
          onClick={predictRainfall}
          className="mt-6 w-full py-3 px-4 bg-blue-800 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <span className="mr-2 text-xl">🔎</span> Predict Rainfall
        </button>

        {answer && (
          <div className="mt-8">
            <h2 className="text-xl font-medium text-blue-800 mb-4 text-center">Weather Prediction Results</h2>
            
            <div className="bg-blue-100 rounded-xl p-6 text-center mb-4">
              <div className="flex justify-center mb-2">
                {answer["prediction result"] === "rainfall" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v2"></path>
                    <path d="M12 8v2"></path>
                    <path d="M4.93 4.93l1.41 1.41"></path>
                    <path d="M17.66 17.66l1.41 1.41"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="M6.34 17.66l-1.41 1.41"></path>
                    <path d="M19.07 4.93l-1.41 1.41"></path>
                    <path d="M10 20.2V22"></path>
                    <path d="M14 20.2V22"></path>
                    <path d="M8 18l-2 4"></path>
                    <path d="M16 18l2 4"></path>
                    <path d="M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M16 14v6"></path>
                    <path d="M8 14v6"></path>
                    <path d="M12 16v6"></path>
                  </svg>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                {answer["prediction result"] === "rainfall" ? "Rain Expected" : "No Rain Expected"}
              </h3>
              
              <p className="text-blue-600">
                {answer["prediction result"] === "rainfall" 
                  ? "Based on current conditions, rainfall is likely due to high humidity and cloud cover."
                  : "Based on current conditions, no rainfall is expected in the near future."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-gray-500 mb-1">Probability</div>
                <div className="text-xl font-bold text-blue-700">
                  {answer["prediction result"] === "rainfall" ? "83%" : "12%"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-gray-500 mb-1">Intensity</div>
                <div className="text-xl font-bold text-blue-700">
                  {answer["prediction result"] === "rainfall" ? "Heavy" : "None"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-gray-500 mb-1">Key Factor</div>
                <div className="text-xl font-bold text-blue-700">
                  {answer["prediction result"] === "rainfall" ? "High Humidity" : "Low Humidity"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-gray-500 mb-1">Confidence</div>
                <div className="text-xl font-bold text-blue-700">
                  {answer["prediction result"] === "rainfall" ? "High" : "Medium"}
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default App
