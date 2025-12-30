import { createContext } from "react";
import { useReducer } from "react";

const initialState = {
  message: null,
  messageType: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MESSAGE":
      return {
        ...state,
        message: action.payload.message,
        messageType: action.payload.type,
      };
    case "CLEAR_MESSAGE":
      return { ...state, message: null, messageType: null };
    default:
      return state;
  }
}
const AdminContext = createContext();
function AdminProvider({ children }) {
  const [{ message, messageType }, dispatch] = useReducer(
    reducer,
    initialState
  );
  return (
    <AdminContext.Provider value={{ message, messageType, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
}

export { AdminProvider, AdminContext };
