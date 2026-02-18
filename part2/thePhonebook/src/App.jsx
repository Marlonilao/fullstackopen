import { useState, useEffect } from "react";
import Filter from "./components/filter";
import PersonForm from "./components/personForm";
import Persons from "./components/persons";
import personService from "./services/persons";
import Notification from "./components/Notification";
import "./index.css";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const resetInputs = () => {
    setNewName("");
    setNewNumber("");
  };

  const addPerson = (e) => {
    e.preventDefault();
    if (persons.some((person) => person.name === newName) && newNumber) {
      if (
        !confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      )
        return;

      const person = persons.find((person) => person.name === newName);
      const updatedPerson = {
        ...person,
        number: newNumber,
      };

      personService
        .update(person.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.name === newName ? returnedPerson : person,
            ),
          );
          setMessage({
            content: `Updated ${newName}'s number`,
            isSuccess: true,
          });
          setTimeout(() => setMessage(null), 5000);
        })
        .catch((error) => {
          setMessage({
            content: `Information of ${newName} has already been removed from server`,
            isSuccess: false,
          });
          setTimeout(() => setMessage(null), 5000);
        });
      resetInputs();
      return;
    }

    // if (persons.some((person) => person.name === newName)) {
    //   alert(`${newName} is already added to phonebook`);
    //   resetInputs();
    //   return;
    // }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setMessage({
          content: `Added ${newPerson.name}`,
          isSuccess: true,
        });
        setTimeout(() => setMessage(null), 5000);
      })
      .catch((error) => {
        setMessage({
          content: error.response.data.error,
          isSuccess: false,
        });
        setTimeout(() => setMessage(null), 5000);
      });
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
    personService.deleteData(id).then(() => {
      setPersons(persons.filter((person) => person.id !== id));
      setMessage({
        content: `${person.name}'s record has been deleted`,
        isSuccess: true,
      });
      setTimeout(() => setMessage(null), 5000);
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
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
