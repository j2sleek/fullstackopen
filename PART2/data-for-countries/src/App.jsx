import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [shownCountries, setShownCountries] = useState([]);

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
  }, [query])

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
              <p>capital {country.capital}</p>
              <p>area {country.area}</p>
              <h2>languages:</h2>
              <ul>
                {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
              </ul>
              <img src={country.flags.png} alt={country.flags.alt} />
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
