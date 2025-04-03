import { useEffect, useState } from "react";
import countriesService from "./services/countriesService";

function App() {
  const [query, setquery] = useState("");
  const [countries, setcountries] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    countriesService.getAll().then((response) => setcountries(response));
  }, []);

  const onQueryTextChange = (searQuery) => {
    setquery(searQuery);
    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searQuery.toLowerCase())
    );
    setFilteredResult(filteredCountries);
    if (filteredCountries.length === 1) {
      countriesService
        .getCountry(filteredCountries[0].name.common)
        .then((country) => setCountry(country));
    } else {
      setCountry(null);
    }
  };

  let countryContent = null;
  if (country) {
    countryContent = (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital[0]}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages)
            .map((value) => (
              <li key={value}>{value}</li>
            ))}
        </ul>
        <img src={country.flags.png} />
      </div>
    );
  }

  let filterContent;

  if (filteredResult.length < 2) {
    filterContent = "";
  } else if (filteredResult.length > 10) {
    filterContent = <p>Too many matches, specify another filter</p>;
  } else {
    let contries = filteredResult.map((country) => (
      <li key={country.name.common}>{country.name.common}</li>
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
