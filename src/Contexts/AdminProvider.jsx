import { createContext } from "react";
import { useReducer } from "react";

const initialState = { activepage: "SHOW_UPLOAD_FORM" };

function reducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_PAGE":
      return { ...state, activepage: action.payload };
    default:
      return state;
  }
}
const AdminContext = createContext();
function AdminProvider({ children }) {
  const [{ activepage }, dispatch] = useReducer(reducer, initialState);
  return (
    <AdminContext.Provider value={{ activepage, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
}

export { AdminProvider, AdminContext };
