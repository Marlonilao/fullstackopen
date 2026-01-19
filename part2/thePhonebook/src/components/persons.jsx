const Persons = ({ personsToShow }) => {
  return (
    <div>
      {personsToShow.length === 0 ? (
        <p>No numbers found</p>
      ) : (
        personsToShow.map((person) => (
          <p key={person.id}>
            {person.name} {person.number}
          </p>
        ))
      )}
    </div>
  );
};

export default Persons;
