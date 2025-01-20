import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonDigging } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  return (
    <div className="flex flex-col h-screen text-slate-800">
      <div className="flex justify-center items-center h-screen">
        <FontAwesomeIcon icon={faPersonDigging} size="4x" />
      </div>
    </div>
  );
};

export default App;
