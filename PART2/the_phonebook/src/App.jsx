import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    personService
      .getPersons()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber
    };
    if (
      persons.map(person => person.name).includes(newName)
    ) {
      alert(`${newName} is already added to phonebook`)
    } else {
        personService
          .addPerson(newPerson)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson));
            setNewName('');
            setNewNumber('');
        })
      }
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(res => {
          setPersons(persons.filter((person) => person.id != res.id))
        })
    }
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    (e.target.value != '' ? setShowAll(false) : setShowAll(true))
  }

  const personToShow = showAll ? persons : persons.filter(
    person => person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handler={handleFilterChange} filter={filter} />
      <h2>add a new</h2>
      <PersonForm 
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        newName={newName}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons 
        personToShow={personToShow}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App