import React from "react";


const Header = (props) => {
    return <h3>{props.course.name}</h3>;
  };
  
  const Content = (props) => {
    return (
      <>
        {props.course.parts.map((item) => (
          <Part key={item.id} part={item.name} exercises={item.exercises} />
        ))}
      </>
    );
  };
  
  const Part = (props) => (
    <p>
      {props.part} {props.exercises}
    </p>
  );
  const Total = ({ parts }) => (
    <p>
      <b>
        Number of exercises{" "}
        {parts.map((part) => part.exercises).reduce((acc, num) => acc + num, 0)}
      </b>
    </p>
  );
  
  const Course = ({ course }) => (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total parts={course.parts} />
    </div>
  );

  export default Course