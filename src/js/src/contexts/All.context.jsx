import { createContext, useState, useReducer } from "react";

export const AllContext = createContext({});

export const AllProvider = ({ children }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [retrievedIncidents, setRetrievedIncidents] = useState(incidents);
  const [showModalAlterPublish, setshowModalAlterPublish] = useState();
  const [showModalAlterMessage, setShowModalAlterMessage] = useState(false);
  const [showModalAlterBackup, setShowModalAlterBackup] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState("");
  const [hideScheduled, setHideScheduled] = useState(false);

  const value = {
    isFetching,
    setIsFetching,
    incidents,
    setIncidents,
    retrievedIncidents,
    setRetrievedIncidents,
    showModalAlterPublish,
    setshowModalAlterPublish,
    showModalAlterMessage,
    setShowModalAlterMessage,
    showModalAlterBackup,
    setShowModalAlterBackup,
    selectedIncident,
    setSelectedIncident,
    hideScheduled,
    setHideScheduled,
  };

  return <AllContext.Provider value={value}>{children}</AllContext.Provider>;
};
