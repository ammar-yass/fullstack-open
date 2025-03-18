import React from "react";

const Header = (props) => {
  return <h1>{props.header}</h1>;
};

const Content = (props) => {
  return (
    <>
      {props.content.map((item) => (
        <Part part={item.part} exercises={item.exercises} />
      ))}
    </>
  );
};

const Part = (props) => (
  <p>
    {props.part} {props.exercises}
  </p>
);
const Total = (props) => <p>Number of exercises {props.totalNumber}</p>;

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <div>
      <Header header={course} />
      <Content
        content={[
          { part: part1, exercises: exercises1 },
          { part: part2, exercises: exercises2 },
          { part: part3, exercises: exercises3 },
        ]}
      />
      <Total totalNumber={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

export default App;
