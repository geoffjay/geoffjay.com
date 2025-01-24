import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import PocketBase from "pocketbase";
import { useInterval } from "usehooks-ts";
import { jwtDecode } from "jwt-decode";
import ms from "ms";

const BASE_URL = import.meta.env.VITE_POCKETBASE_URL || "http://localhost:8081";
const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

const PocketbaseContext = createContext({});

export const PocketbaseProvider = ({ children }) => {
  const pb = useMemo(() => new PocketBase(BASE_URL), []);

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState(pb.authStore.record);

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model);
    });
  }, []);

  const register = useCallback(async (email, password) => {
    return await pb
      .collection("users")
      .create({ email, password, passwordConfirm: password });
  }, []);

  const login = useCallback(async (email, password) => {
    return await pb.collection("users").authWithPassword(email, password);
  }, []);

  const loginGithub = useCallback(async () => {
    return await pb.collection("users").authWithOAuth2({ provider: "github" });
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, []);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);

  return (
    <PocketbaseContext.Provider
      value={{ register, login, loginGithub, logout, user, token, pb }}
    >
      {children}
    </PocketbaseContext.Provider>
  );
};

PocketbaseProvider.propTypes = {
  children: PropTypes.node,
};

export const usePocketbase = () => useContext(PocketbaseContext);
