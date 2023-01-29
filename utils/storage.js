export const loadState = (key, typeOfValue) => {
  try {
    if (typeof window !== 'undefined') {
      const serializedState = localStorage.getItem(key);
      if (!serializedState) {
        return undefined;
      }
      return JSON.parse(serializedState);
    }
  } catch (e) {
    return undefined;
  }
};

export const saveState = async (key, state) => {
  try {
    if (typeof window !== 'undefined') {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(key, serializedState);
    }
  } catch (e) { }
};
