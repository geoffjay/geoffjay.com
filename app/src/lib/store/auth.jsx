import { create } from "zustand";

const useAuth = create(() => ({
  authData: undefined,
  logout: () => {},
}));

export default useAuth;
