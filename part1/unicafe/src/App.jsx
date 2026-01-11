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
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  );
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Statistics = (props) => {
  const { good, neutral, bad, all, average, positive } = props;
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <div>
        <h2>Statistics</h2>
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Statistics</h2>
      <StatisticLine statName={"good"} statNumber={good} />
      <StatisticLine statName={"neutral"} statNumber={neutral} />
      <StatisticLine statName={"bad"} statNumber={bad} />
      <StatisticLine statName={"all"} statNumber={all} />
      <StatisticLine statName={"average"} statNumber={average} />
      <StatisticLine statName={"positive"} statNumber={positive} />
    </div>
  );
};

const StatisticLine = ({ statName, statNumber }) => (
  <p>
    {statName}: {statNumber}
  </p>
);

export default App;
