import React from "react";

const Persons = ({ persons, onDelete }) => (
  <div>
    {persons.map(({ name, number, id }) => (
        <p key={name}>
          {name} {number}   <button onClick={() => onDelete(id)}>delete</button>

        </p>
    ))}
  </div>
);

export default Persons;
