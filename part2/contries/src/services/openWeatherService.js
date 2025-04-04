import axios from "axios";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";
const api_key = import.meta.env.VITE_SOME_KEY;

const getCapitalWeather = (lat, lon) => {
  return axios
    .get(`${baseUrl}lat=${lat}&lon=${lon}&appid=${api_key}`)
    .then((response) => response.data);
};

export default {
  getCapitalWeather,
};
