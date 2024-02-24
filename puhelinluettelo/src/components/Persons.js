import Person from './Person'

const Persons = ({ records, deleteHandler }) => (
  <ul>
    {records.map(
      person =>
        <Person
          key={person.name}
          person={person}
          handler={deleteHandler}
        />
      )
    }
  </ul>
)

export default Persons