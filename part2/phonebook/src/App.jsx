import { useEffect, useState } from "react";
import React from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phonebookService from "./services/phonebook";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewphone] = useState("");
  const [filterText, SetFilterText] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    isSuccess: false,
  });

  useEffect(() => {
    getAll();
  }, []);

  const addContact = (event) => {
    event.preventDefault();
    const exisitingPerson = persons.find((person) => person.name === newName);
    console.log("add contect");
    if (exisitingPerson && newPhone === exisitingPerson.number) {
      console.log("exisitingPerson", exisitingPerson);
      alert(`${newName} is already added to phonebook`);
      return;
    }
    if (
      exisitingPerson &&
      newPhone !== exisitingPerson.number &&
      confirm(
        `${exisitingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      console.log("exisitingPerson diff phone numbber", exisitingPerson);
      let newPeron = { ...exisitingPerson, number: newPhone };
      phonebookService
        .updateContact(exisitingPerson.id, newPeron)
        .then((_) => {
          showNotification(`added ${newPeron.name}`, true)
          return getAll();
        });
      return;
    }
    phonebookService
      .createContact({ name: newName, number: newPhone })
      .then((_) => {
        showNotification(`added ${newName}`, true)
        return getAll();
      })
      .catch(error => { showNotification(error.response.data.error)})
    setNewName("");
    setNewphone("");
  };

  const setFilter = (event) => {
    const filterText = event.target.value;
    SetFilterText(filterText);
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (confirm(`delete ${person.name}?`))
      phonebookService
        .deletePerson(id)
        .then((_) => getAll())
        .catch(() =>
          showNotification(
            `infromation of ${person.name} has already been removed from server`,
            false
          )
        );
  };

  const getAll = () => {
    phonebookService.getAll().then((response) => {
      console.log(response);
      return setPersons(response);
    });
  };

  const showNotification = (message, isSuccess) => {
    console.log(message, isSuccess);
    
    setNotification({ message, isSuccess });
    setTimeout(() => {
      setNotification({ message: null, isSuccess: true });
    }, 5000);
  };

  const displayedPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterText.trim().toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification.message}
        isSuccess={notification.isSuccess}
      />
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
      <Persons persons={displayedPersons} onDelete={(id) => deletePerson(id)} />
    </div>
  );
};

export default App;
``