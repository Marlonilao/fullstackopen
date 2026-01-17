import { useState } from "react";

const Header = (props) => <h1>{props.course}</h1>;

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part, i) => (
        <Part key={i} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

const Part = (props) => (
  <p>
    {props.name} {props.exercises}
  </p>
);

const Total = (props) => <p>Number of exercises {props.total}</p>;

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      {/* <Total
        total={
          course.parts[0].exercises +
          course.parts[1].exercises +
          course.parts[2].exercises
        }
      /> */}
    </div>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <>
      <Course course={course} />
    </>
  );
};

export default App;
