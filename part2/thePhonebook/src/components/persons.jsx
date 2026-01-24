const Persons = ({ personsToShow, onClick }) => {
  return (
    <div>
      {personsToShow.length === 0 ? (
        <p>No numbers found</p>
      ) : (
        personsToShow.map((person) => (
          <p key={person.id}>
            {person.name} {person.number}{" "}
            <button type="button" onClick={() => onClick(person.id)}>
              Delete
            </button>
          </p>
        ))
      )}
    </div>
  );
};

export default Persons;
