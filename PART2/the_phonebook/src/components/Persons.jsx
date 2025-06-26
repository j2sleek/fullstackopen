const Persons = ({personToShow, handleDelete}) => {

    return (
        <div>
          {personToShow.map(person => (
            <p key={person.id}>{person.name} {person.number} <button onClick={() => handleDelete(person.id, person.name)}>delete</button></p>
            )
          )}
        </div>
    )
}

export default Persons