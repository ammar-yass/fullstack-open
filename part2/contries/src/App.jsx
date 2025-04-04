import { use, useEffect, useState } from "react";
import countriesService from "./services/countriesService";
import openWeatherService from "./services/openWeatherService";

function App() {
  const [query, setquery] = useState("");
  const [countries, setcountries] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);
  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countriesService.getAll().then((response) => setcountries(response));
  }, []);

  const onQueryTextChange = (searQuery) => {
    setquery(searQuery);
    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searQuery.toLowerCase())
    );
    setFilteredResult(filteredCountries);
    onFilteedCountriesChange(filteredCountries);
  };

  const onFilteedCountriesChange = (filteredCountries) => {
    if (filteredCountries.length === 1) {
      countriesService
        .getCountry(filteredCountries[0].name.common)
        .then((country) => {
          const [lat, lng] = country.capitalInfo.latlng;
          openWeatherService
            .getCapitalWeather(lat, lng)
            .then((weather) => setWeather(weather));
            setCountry(country);
        });
    } else {
      setCountry(null);
      setWeather(null)
    }
  };

  let countryContent = null;
  if (country && weather) {
    console.log(weather)
    const weatherIcon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png `
    countryContent = (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital[0]}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
        <img src={country.flags.png}/>
        <h1>weather in {country.capital[0]}</h1>
        <p>Temprature {weather.main.temp} celsius</p>
        <img src={weatherIcon}/>
        <p>Wind {weather.wind.speed} m/s</p>
      </div>
    );
  }

  const onSelectCountry = (country) => {
    let filteredCountries = [country];
    setFilteredResult(filteredCountries);
    onFilteedCountriesChange(filteredCountries);
  };

  let filterContent;

  if (filteredResult.length < 2) {
    filterContent = "";
  } else if (filteredResult.length > 10) {
    filterContent = <p>Too many matches, specify another filter</p>;
  } else {
    let contries = filteredResult.map((country) => (
      <li key={country.name.common}>
        {country.name.common}{" "}
        <button onClick={() => onSelectCountry(country)}>Show</button>
      </li>
    ));
    filterContent = <ul>{contries}</ul>;
  }

  return (
    <div>
      <p>
        Find countries{" "}
        <input
          value={query}
          onChange={(e) => onQueryTextChange(e.target.value)}
        />
      </p>
      {filterContent}
      {countryContent}
    </div>
  );
}

export default App;
