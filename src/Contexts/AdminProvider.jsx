import { createContext } from "react";
import { useReducer } from "react";

const initialState = {
  activepage: "SHOW_UPLOAD_FORM",
  message: null,
  messageType: null,
  id: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_PAGE":
      return {
        ...state,
        activepage: action.payload.page,
        id: action.payload.id || null,
      };
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
  const [{ activepage, message, messageType, id }, dispatch] = useReducer(
    reducer,
    initialState
  );
  return (
    <AdminContext.Provider
      value={{ activepage, message, messageType, id, dispatch }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export { AdminProvider, AdminContext };
