import React from "react";

const Header = (props) => {
  return <h1>{props.course.name}</h1>;
};

const Content = (props) => {
  return (
    <>
      {props.course.parts.map((item) => (
        <Part part={item.name} exercises={item.exercises} />
      ))}
    </>
  );
};

const Part = (props) => (
  <p>
    {props.part} {props.exercises}
  </p>
);
const Total = (props) => <p>Number of exercises {props.course.parts.map(part => part.exercises).reduce((acc, num) => acc + num, 0)}</p>;

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

export default App;
