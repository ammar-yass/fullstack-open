import { useEffect, useState } from "react";
import React from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewphone] = useState("");
  const [filterText, SetFilterText] = useState("");

  useEffect(()=> { 
    axios
    .get('http://localhost:3001/persons')
    .then((response) => { 
        console.log("promis fullfilled", response)
        setPersons(response.data)
    })
  }, [])

  const addContact = (event) => {
    event.preventDefault();
    const exisitingPerson = persons.find((person) => person.name === newName);
    if (exisitingPerson) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const newList = persons.concat({ name: newName, number: newPhone });
    setPersons(newList);
    setNewName("");
    setNewphone("");
  };

  const setFilter = (event) => {
    const filterText = event.target.value;
    SetFilterText(filterText);
  };

  const displayedPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterText.trim().toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterText={filterText} onFilterChange={setFilter} />
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
