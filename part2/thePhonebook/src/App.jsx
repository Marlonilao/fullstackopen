import { useState, useEffect } from "react";
import Filter from "./components/filter";
import PersonForm from "./components/personForm";
import Persons from "./components/persons";
import personService from "./services/persons";
import axios from "axios";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));

    // axios.get("http://localhost:3001/persons").then((response) => {
    //   console.log("promise fulfilled");
    //   setPersons(response.data);
    // });
  }, []);

  const resetInputs = () => {
    setNewName("");
    setNewNumber("");
  };

  const addPerson = (e) => {
    e.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      resetInputs();
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(newPerson)
      .then((returnedPerson) => setPersons(persons.concat(returnedPerson)));
    resetInputs();
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().startsWith(filter.toLowerCase()),
      )
    : persons;

  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleDeletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (!confirm(`Delete ${person.name}?`)) return;
    personService
      .deleteData(id)
      .then(() => setPersons(persons.filter((person) => person.id !== id)));
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onChangeName={handleNameChange}
        newNumber={newNumber}
        onChangeNumber={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} onClick={handleDeletePerson} />
    </div>
  );
}

export default App;
