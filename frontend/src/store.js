import React, { createContext, useContext } from "react";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
} from "use-reducer-with-side-effects";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";

const AppContext = createContext();

const reducer = (prevState, action) => {
  const { type } = action;
  if (type === SET_TOKEN) {
    const { payload: jwtToken, pk } = action;
    const newState = { ...prevState, jwtToken, pk };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("jwtToken", jwtToken);
    });
  } else if (type === DELETE_TOKEN) {
    const newState = { ...prevState, jwtToken: "" };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("jwtToken", "");
    });
  } else if (type === SET_GROUP) {
    const { payload: group } = action;
    const newState = { ...prevState, group };
    return Update(newState);
  } else if (type === DELETE_GROUP) {
    const newState = { ...prevState, group: "" };
    return Update(newState);
  }

  return prevState;
};

export const AppProvider = ({ children }) => {
  const jwtToken = getStorageItem("jwtToken", "");
  const [store, dispatch] = useReducerWithSideEffects(reducer, {
    jwtToken,
    pk: -1,
    group: "",
  });
  return (
    <AppContext.Provider value={{ store, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

// Actions
const SET_TOKEN = "APP/SET_TOKEN";
const DELETE_TOKEN = "APP/DELETE_TOKEN";
const SET_GROUP = "APP/SET_GROUP";
const DELETE_GROUP = "APP/DELETE_GROUP";

// Action Creators
export const setToken = (token, pk) => ({
  type: SET_TOKEN,
  payload: token,
  pk,
});
export const deleteToken = () => ({ type: DELETE_TOKEN });

export const setGroup = (group) => ({
  type: SET_GROUP,
  payload: group,
});

export const deleteGroup = () => ({ type: DELETE_GROUP });
