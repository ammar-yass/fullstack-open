import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const incrementGood = () => {
    const newValue = good + 1;
    setGood(newValue);
    console.log("incrementGood", newValue);
  };
  const incrementNeutral = () => {
    const newValue = neutral + 1;
    setNeutral(newValue);
    console.log("incrementNeutral", newValue);
  };
  const incrementbad = () => {
    const newValue = bad + 1;
    setBad(newValue);
    console.log("incrementbad", newValue);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="Good" onClick={incrementGood} />
      <Button text="Natural" onClick={incrementNeutral} />
      <Button text="Bad" onClick={incrementbad} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const Statistics = ({ good, neutral, bad }) => {
  let sum = good + neutral + bad;
  let tableContent
  if(sum == 0) { 
    tableContent = <p>no feedback provided</p>
  } else { 
    let postive
    tableContent = <table>
    <tbody>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="all" value={sum} />
      <StatisticLine text="average" value={(good*1 + bad* -1)/sum} />
      <StatisticLine text="Postive" value={`${((good/sum)*100)}%`}/>
    </tbody>
  </table>
  }

  return (
    <div>
      <h1>Statistics</h1>
      {tableContent}  
    </div>
  );
};

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

export default App;
