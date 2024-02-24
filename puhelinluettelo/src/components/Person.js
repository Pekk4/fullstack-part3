const Person = ({ person, handler }) => (
    <li>
        {person.name}{' '}
        {person.number}{' '}
        <button type="submit" onClick={() => {handler(person)}}>Delete</button>
    </li>
)

export default Person