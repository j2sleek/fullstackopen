import { useState, useEffect, useCallback, use } from 'react';
import axios from 'axios';

const api_key = import.meta.env.VITE_OPEN_API;

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [shownCountries, setShownCountries] = useState([]);
  const [captial, setCapital] = useState('');

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(res => setCountries(res.data))
      .catch(err => {
        setCountries([]);
      })
  }, [])

  useEffect(() => {
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()));
    setShownCountries(filteredCountries);
    setCapital(filteredCountries.length === 1 ? filteredCountries[0].capital : '');
  }, [query])

  useEffect(() => {
    if (captial !== '') {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${captial}&appid=${api_key}&units=metric`)
        .then(res => {
          setShownCountries([{
            ...shownCountries[0],
            temperature: res.data.main.temp,
            wind: res.data.wind.speed,
            icon: `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`
          }])
        })
        .catch(err => {
          setShownCountries([]);
        })
    }
  }, [captial])

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <p>
        find countries <input value={query} onChange={handleChange}/>
      </p>
      {
        (shownCountries.length > 10) 
        ?
        'Too many matches, specify another filter'
        :
        (shownCountries.length > 1 && shownCountries.length <= 10)
        ?
        shownCountries.map(country => (
            <p key={country.name.official}>
              {country.name.common} 
              <button onClick={() => setQuery(country.name.common)}>Show</button>
            </p>))
        :
        (shownCountries.length === 1)
        ?
        shownCountries.map(country => (
            <div key={country.name.official}>
              <h1>{country.name.common}</h1>
              <p>Capital {country.capital}</p>
              <p>Area {country.area}</p>
              <h2>Languages:</h2>
              <ul>
                {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
              </ul>
              <img src={country.flags.png} alt={country.flags.alt} />
              <h2>Weather in {country.capital}</h2>
              <p>Temperature {country.temperature} Celsius</p>
              <img src={country.icon} alt={country.flags.alt} />
              <p>Wind {country.wind} m/s</p>
            </div>
          )
        )
        :
        (query === '')
        ?
        'start typing to search for a country...'
        :
        'no match, try again with another filter.'
      }
    </>
  )
}

export default App
