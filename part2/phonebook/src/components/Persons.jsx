import React from "react";

const Persons = ({ persons }) => (
  <div>
    {persons.map(({ name, number }) => (
      <p key={name}>
        {name} {number}
      </p>
    ))}
  </div>
);

export default Persons;
