const Country = (props) => {
  const languagesArray = [];

  Object.values(props.languages).forEach((value) => languagesArray.push(value));
  return (
    <div>
      <h1>{props.name}</h1>
      <p>Capital {props.capital}</p>
      <p>Area {props.area}</p>
      <div>
        <h3>Languages</h3>
        <ul>
          {languagesArray.map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
      </div>
      <img alt={props.flags.alt} src={props.flags.png} />
    </div>
  );
};

export default Country;
