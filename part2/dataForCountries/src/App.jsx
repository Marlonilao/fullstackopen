import { useState, useEffect } from "react";
import axios from "axios";
import Country from "./components/Country";
import CountryListItem from "./components/CountryListItem";

function App() {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState(null);

  const countriesToShow = value
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(value.toLowerCase()),
      )
    : [];

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        console.log(response);
        setCountries(response.data);
      });
  }, []);

  if (!countries) {
    return <p>Loading countries from API...</p>;
  }

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <label>
        find countries: <input value={value} onChange={handleChange} />
      </label>
      <div>
        {countriesToShow.length === 0 ? null : countriesToShow.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countriesToShow.length > 1 ? (
          countriesToShow.map((country) => (
            // <p key={country.name.common}>{country.name.common}</p>
            <CountryListItem
              name={country.name.common}
              children={
                <Country
                  name={country.name.common}
                  capital={country.capital[0]}
                  area={country.area}
                  languages={country.languages}
                  flags={country.flags}
                />
              }
            />
          ))
        ) : (
          <Country
            name={countriesToShow[0].name.common}
            capital={countriesToShow[0].capital[0]}
            area={countriesToShow[0].area}
            languages={countriesToShow[0].languages}
            flags={countriesToShow[0].flags}
          />
        )}
      </div>
    </>
  );
}

export default App;
