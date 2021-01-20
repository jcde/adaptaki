function rootReducer(state, action) {
  let newState = {};
  newState[action.type] = action.value;
  for (let key in state)
    if (key && key != action.type)
      newState[key] = state[key];
  return newState;
}

export default rootReducer;