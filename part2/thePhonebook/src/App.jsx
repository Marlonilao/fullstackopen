import { useState } from "react";

function App() {
  const [persons, setPersons] = useState([{ name: "Marlon Ilao" }]);
  const [newName, setNewName] = useState("");

  const addPerson = (e) => {
    e.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      setNewName("");
      return;
    }
    setPersons([...persons, { name: newName }]);
    setNewName("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name:{" "}
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.length > 0
          ? persons.map((person) => <p key={person.name}>{person.name}</p>)
          : null}
      </div>
    </div>
  );
}

export default App;
