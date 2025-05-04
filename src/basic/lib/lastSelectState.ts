export default function lastSelectState() {
  let lastState = null;

  function setState(state) {
    lastState = state;
  }
  function getState() {
    return lastState;
  }

  return { setState, getState };
}
