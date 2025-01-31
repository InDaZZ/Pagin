import spiner from "./images/spinner1-svgrepo-com.svg";

function Loader() {
  return (
    <div className="Loader">
      <img className="spiner" src={`${spiner}`} alt="spiner"></img>
    </div>
  );
}

export default Loader;
