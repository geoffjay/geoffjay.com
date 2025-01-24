import { useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router";

import { Button } from "@/components/ui/button";

import { usePocketbase } from "@/lib/context/PocketbaseContext";

export const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { register } = usePocketbase();
  const navigate = useNavigate();

  const handleOnSubmit = useCallback(
    async (evt) => {
      evt?.preventDefault();
      await register(emailRef.current.value, passwordRef.current.value);
      navigate("/sign-in");
    },
    [register],
  );

  return (
    <section className="m-4">
      <h2 className="text-2xl pb-4">Sign Up</h2>
      <form className="flex flex-col gap-2" onSubmit={handleOnSubmit}>
        <input placeholder="Email" type="email" ref={emailRef} />
        <input placeholder="Password" type="password" ref={passwordRef} />
        <Button type="submit">Create</Button>
        <Link to="/sign-in">Go to Sign In</Link>
      </form>
    </section>
  );
};
