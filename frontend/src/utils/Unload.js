import PropTypes from "prop-types";
import { useEffect } from "react";
import useLatest from "use-latest";

var useUnload = function useUnload(handler) {
  if (handler === void 0) {
    handler = function handler() {};
  }

  if (process.env.NODE_ENV !== "production" && typeof handler !== "function") {
    throw new TypeError(
      'Expected "handler" to be a function, not ' + typeof handler + "."
    );
  }

  var handlerRef = useLatest(handler);
  useEffect(
    function () {
      var handleUnload = function handleUnload(event) {
        var returnValue = handlerRef.current(event); // Chrome requires `returnValue` to be set.

        if (event.defaultPrevented) {
          event.returnValue = "";
        }

        if (typeof returnValue === "string") {
          event.returnValue = returnValue;
          return returnValue;
        }
      };

      window.addEventListener("unload", handleUnload);
      return function () {
        window.removeEventListener("unload", handleUnload);
      };
    },
    [handlerRef]
  );
};

var Unload = function Unload(props) {
  useUnload(props.onUnload);
  return props.children;
};

Unload.defaultProps = {
  children: null,
};
Unload.propTypes = {
  children: PropTypes.any,
  onUnload: PropTypes.func.isRequired,
};

export { Unload, useUnload };
