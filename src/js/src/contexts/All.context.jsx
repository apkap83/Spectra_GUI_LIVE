import { createContext, useState, useReducer } from "react";

export const AllContext = createContext({});

export const AllProvider = ({ children }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [showModalAlterPublish, setshowModalAlterPublish] = useState();
  const [showModalAlterMessage, setShowModalAlterMessage] = useState(false);
  const [showModalAlterBackup, setShowModalAlterBackup] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState("");

  const value = {
    isFetching,
    setIsFetching,
    incidents,
    setIncidents,
    showModalAlterPublish,
    setshowModalAlterPublish,
    showModalAlterMessage,
    setShowModalAlterMessage,
    showModalAlterBackup,
    setShowModalAlterBackup,
    selectedIncident,
    setSelectedIncident,
  };

  return <AllContext.Provider value={value}>{children}</AllContext.Provider>;
};
