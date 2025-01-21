import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonDigging } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import { Button } from "@/components/ui/button";

const App = () => {
  return (
    <div className="flex flex-col h-screen text-slate-800">
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col gap-4">
          <FontAwesomeIcon icon={faPersonDigging} size="4x" />
          <Button>
            <div className="flex gap-2">
              <FontAwesomeIcon icon={faGithub} />
              <p>Login with GitHub</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
