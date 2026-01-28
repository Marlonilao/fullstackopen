import { useState, useEffect } from "react";
import axios from "axios";

const api_key = import.meta.env.VITE_SOME_KEY;

const WeatherReport = (props) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${props.location}?unitGroup=metric&key=${api_key}`,
      )
      .then((response) => {
        console.log("Weather report", response.data);
        setWeatherData(response.data);
      });
  }, []);

  if (!weatherData) {
    return <p>Fetching weather report...</p>;
  }

  return (
    <div>
      <h2>Weather in {props.location}</h2>
      <p>Temperature {weatherData.currentConditions.temp} Celsius</p>
      <img
        src={`/src/weatherIcons/${weatherData.currentConditions.icon}.png`}
        alt={weatherData.currentConditions.icon}
      />
      <p>Wind {weatherData.currentConditions.windspeed} kph</p>
    </div>
  );
};

export default WeatherReport;
