import { useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import { Button } from "@/components/ui/button";

import { usePocketbase } from "@/lib/context/PocketbaseContext";

export const SignIn = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, loginGithub } = usePocketbase();
  const navigate = useNavigate();

  const handleOnSubmit = useCallback(
    async (evt) => {
      evt?.preventDefault();
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    },
    [login],
  );

  const handleLoginGithub = useCallback(async () => {
    await loginGithub();
    navigate("/");
  }, [loginGithub]);

  return (
    <section className="m-4 flex flex-col gap-2">
      <h2 className="text-2xl pb-4">Sign In</h2>
      <form className="flex flex-col gap-2" onSubmit={handleOnSubmit}>
        <input placeholder="Email" type="email" ref={emailRef} />
        <input placeholder="Password" type="password" ref={passwordRef} />
        <Button type="submit">Login</Button>
        <Link to="/sign-up">Go to Sign Up</Link>
      </form>
      <Button onClick={handleLoginGithub}>
        <div className="flex gap-2">
          <FontAwesomeIcon icon={faGithub} />
          <p>Login with GitHub</p>
        </div>
      </Button>
    </section>
  );
};
