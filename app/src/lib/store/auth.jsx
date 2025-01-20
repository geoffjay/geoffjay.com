import { create } from "zustand";

const useAuth = create(() => ({
  authData: undefined,
}));

export default useAuth;
