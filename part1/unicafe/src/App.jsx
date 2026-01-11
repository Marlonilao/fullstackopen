import { useState } from "react";

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;
  const average = (all / 3).toFixed(2);
  const positive = ((good / all) * 100).toFixed(2) + "%";

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGoodClick} text={"good"} />
      <Button onClick={handleNeutralClick} text={"neutral"} />
      <Button onClick={handleBadClick} text={"bad"} />
      <h2>Statistics</h2>
      <Statistics statName={"good"} statNumber={good} />
      <Statistics statName={"neutral"} statNumber={neutral} />
      <Statistics statName={"bad"} statNumber={bad} />
      <Statistics statName={"all"} statNumber={all} />
      <Statistics statName={"average"} statNumber={average} />
      <Statistics statName={"positive"} statNumber={positive} />
    </div>
  );
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;
const Statistics = ({ statName, statNumber }) => {
  if (statName === "positive" && statNumber === NaN + "%") {
    return <p>{statName}: N/A</p>;
  }

  return (
    <p>
      {statName}: {statNumber}
    </p>
  );
};

export default App;
