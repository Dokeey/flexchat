import React from "react";
import { Route } from "react-router-dom";
import Home from "./home";
import { Beforeunload } from "react-beforeunload";
import { useAppContext, deleteToken, deleteGroup } from "store";
import { API_HOST } from "Constants";

function Root() {
  const {
    store: { pk },
    dispatch,
  } = useAppContext();

  const userDelete = async () => {
    dispatch(deleteToken());
    dispatch(deleteGroup());
    const HOST = API_HOST;
    // const HOST = "http://localhost";
    try {
      navigator.sendBeacon(`${HOST}/accounts/delete/${pk}/`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Beforeunload onBeforeunload={() => userDelete()}>
      <Route path="/" component={Home} />
    </Beforeunload>
  );
}

export default Root;
