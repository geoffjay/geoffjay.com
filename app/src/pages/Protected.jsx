import { usePocketbase } from "@/lib/context/PocketbaseContext";

export const Protected = () => {
  const { logout, user } = usePocketbase();

  return (
    <section className="m-4">
      <h2 className="text-2xl pb-4">Protected</h2>
      <div className="flex flex-col gap-2">
        <pre>
          <code>{JSON.stringify(user, null, 2)}</code>
        </pre>
        <button onClick={logout}>Logout</button>
      </div>
    </section>
  );
};
