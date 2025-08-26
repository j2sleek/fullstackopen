import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState({message: null, status: null })

  useEffect(() => {
    personService
      .getPersons()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  const handleSubmit = (e) => {
    const personsNames = persons.map(person => person.name);
  
    e.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber
    };
    if (
      personsNames.includes(newName)
    ) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName);
        const updatedPerson = {...personToUpdate, number: newNumber};

        personService
          .updatePerson(personToUpdate.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === personToUpdate.id ? returnedPerson : person));
            setNotification({
              message:`Updated ${returnedPerson.name}'s number`,
              status: 'success'
            });
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setNotification({
              message:`Information of ${personToUpdate.name} has already been removed from server`,
              status: 'error'
            });
            setPersons(persons.filter((person) => person.id != personToUpdate.id));
        })
      }
    } else {
        personService
          .addPerson(newPerson)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson));
            setNotification({
              message:`Added ${returnedPerson.name}`,
              status: 'success'
            });
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setNotification({
              message:error.response.data.error,
              status: 'error'
            });
          })
      }
    setTimeout(() => {
      setNotification({
        message: null,
        status: null
      })
    }, 5000) 
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
          setPersons(persons.filter((person) => person.id != id));
          setNotification({
            message:`Deleted ${name}`,
            status: 'success'
          });
        })
        .catch(error => {
            setNotification({
              message:`Information of ${name} has already been removed from server`,
              status: 'error'
            });
            setPersons(persons.filter((person) => person.id != id));
        })
    }
    setTimeout(() => {
      setNotification({
        message: null,
        status: null
      })
    }, 5000)
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
      <Notification message={notification.message} status={notification.status} />
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