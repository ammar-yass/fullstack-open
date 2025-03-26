import { useState } from "react";
import React from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);

  const [displayedPersons, setDisplayedPersons] = useState(persons);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewphone] = useState("");
  const [filterText, SetFilterText] = useState("");

  const addContact = (event) => {
    event.preventDefault();
    const exisitingPerson = persons.find((person) => person.name === newName);
    if (exisitingPerson) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const newList = persons.concat({ name: newName, number: newPhone });
    setPersons(newList);
    setDisplayedPersons(newList);
    setNewName("");
    setNewphone("");
  };

  const filterDisplayedPersons = (event) => {
    const filterText = event.target.value;
    SetFilterText(filterText);
    if (filterText.trim() === "") {
      setDisplayedPersons(persons);
    } else {
      setDisplayedPersons(persons.filter((person) => person.name.includes(filterText)));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterText={filterText} onFilterChange={filterDisplayedPersons} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newPhone={newPhone}
        onNameChange={(event) => setNewName(event.target.value)}
        onPhoneChange={(event) => setNewphone(event.target.value)}
        onSubmit={addContact}
      />
      <h3>Numbers</h3>
      <Persons persons={displayedPersons} />
    </div>
  );
};

export default App;
