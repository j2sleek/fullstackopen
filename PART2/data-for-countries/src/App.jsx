import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (query) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(res => {
          const allCountries = res.data;
          const filteredCountries = allCountries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()));
          setCountries(filteredCountries);
        })
        .catch(err => {
          setCountries([]);
        })
    }
  }, [query])

  const handleChange = e => {
    setQuery(e.target.value);
  }

  return (
    <>
      <p>
        find countries <input value={query} onChange={handleChange}/>
      </p>
      {
        (countries.length > 10) 
        ?
        'Too many matches, specify another filter'
        :
        (countries.length > 1 && countries.length <= 10)
        ?
        countries.map(country => <p key={country.name.official}>{country.name.common}</p>)
        :
        (countries.length === 1)
        ?
        countries.map(country => (
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
