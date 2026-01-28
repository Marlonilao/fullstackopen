import { useState } from "react";
// import Country from "./Country";

const CountryListItem = (props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div>
        {props.name}{" "}
        <button
          type="button"
          onClick={() => {
            setIsActive(!isActive);
          }}
        >
          {isActive ? "Hide" : "Show"}
        </button>
        {isActive ? (
          // <Country
          //   name={props.name}
          //   capital={props.capital}
          //   area={props.area}
          //   languages={props.languages}
          //   flags={props.flags}
          // />
          <p>{props.children}</p>
        ) : null}
      </div>
    </>
  );
};

export default CountryListItem;
