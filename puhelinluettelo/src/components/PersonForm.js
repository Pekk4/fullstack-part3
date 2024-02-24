const PersonForm = ( props ) => (
  <form onSubmit={props.submitHandler}>
    <div>
      Name:
      <input
        value={props.newName}
        onChange={props.nameHandler}
      />
    </div>
    <div>
      Number: 
      <input
        value={props.newNumber}
        onChange={props.numberHandler}
      />
    </div>
    <div>
      <button type="submit">Add</button>
    </div>
  </form>
)

export default PersonForm