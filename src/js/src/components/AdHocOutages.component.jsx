import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinnerCentered from "./Spinner/LoadingSpinnerCentered.component";
import { getAdHocOutages } from "../services/incidentService";
import { errorNotification } from "../Notification";

// Antd Library
import { Table, Button } from "antd";

// MUI Icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export function AdHocOutages() {
  const [designatedFile, setDesignatedFile] = useState("");
  const [currentAdHocIsFetching, setCurrentAdHocIsFetching] = useState(false);
  const [newAdHocIsFetching, setNewAdHocIsFetching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [uploadedTableData, setUploadedTableData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isCommitButtonEnabled, setIsCommitButtonEnabled] = useState(false);
  const [isPreviewButtonEnabled, setIsPreviewButtonEnabled] = useState(false);

  const handleFileSelect = (event) => {
    setDesignatedFile(event.target.files[0]);
    setIsPreviewButtonEnabled(true);
  };

  const handlePreview = async (event) => {
    event.preventDefault();
    setIsPreviewButtonEnabled(false);
    const formData = new FormData();
    formData.append("file", designatedFile);

    setTimeout(async () => {
      try {
        setNewAdHocIsFetching(true);
        const response = await axios({
          method: "post",
          url: "/api/incidents/previewadhocfile",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploadedTableData(response.data);
        setNewAdHocIsFetching(false);
        setErrorMessage(false);
        setSuccessMessage(
          "The provided excel file has passed all health checks"
        );
        setIsCommitButtonEnabled(true);
      } catch (error) {
        setNewAdHocIsFetching(false);
        setErrorMessage(error.response.data.message);
        setSuccessMessage(false);
        console.log(error.response.data.message);
      }
    }, 1);
  };

  const handleCommitToDB = (event) => {
    const formData = new FormData();
    formData.append("file", designatedFile);
    setTimeout(async () => {
      try {
        setIsCommitButtonEnabled(false);
        setCurrentAdHocIsFetching(true);
        setErrorMessage(false);
        const response = await axios({
          method: "post",
          url: "/api/incidents/uploadadhocfile",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploadedTableData(response.data);
        setCurrentAdHocIsFetching(false);
        setErrorMessage(false);
        setInfoMessage(
          "The provided excel file has been uploaded successfully"
        );
        // Setting again Current Ad-Hoc Outages Table
        setTimeout(async () => {
          try {
            setCurrentAdHocIsFetching(true);
            const { data } = await getAdHocOutages();
            setTableData(data);
            setCurrentAdHocIsFetching(false);
          } catch (error) {
            errorNotification(error.code, error.message);
          }
        }, 1);
      } catch (error) {
        setCurrentAdHocIsFetching(false);
        setErrorMessage(error.response.data.message);
        setSuccessMessage(false);
      }
    }, 1);
  };

  const columnsForCurrentAdHocOutages = [
    {
      title: "ID",
      key: (incident) => incident.id,
      render: (incident) => incident.id,
    },
    {
      title: "Cli Value",
      key: (incident) => incident.id,
      render: (incident) => incident.cliValue,
    },
    {
      title: "Start Date",
      key: (incident) => incident.id,
      render: (incident) => incident.Start_DateTime,
    },
    {
      title: "End Date",
      key: (incident) => incident.id,
      render: (incident) => incident.End_DateTime,
    },
    {
      title: "Backup Eligible",
      key: (incident) => incident.id,
      render: (incident) => incident.backupEligible,
    },
    {
      title: "Message",
      key: (incident) => incident.id,
      render: (incident) => incident.message,
    },
    {
      title: "",
      key: (incident) => incident.id,
      render: (incident) => renderEntryDeleteButton(incident),
    },
  ];

  const columnsForNewAdHocOutages = [
    {
      title: "ID",
      key: (incident) => incident.id,
      render: (incident) => incident.id,
    },
    {
      title: "Cli Value",
      key: (incident) => incident.id,
      render: (incident) => incident.cliValue,
    },
    {
      title: "Start Date",
      key: (incident) => incident.id,
      render: (incident) => incident.Start_DateTime,
    },
    {
      title: "End Date",
      key: (incident) => incident.id,
      render: (incident) => incident.End_DateTime,
    },
    {
      title: "Backup Eligible",
      key: (incident) => incident.id,
      render: (incident) => incident.backupEligible,
    },
    {
      title: "Message",
      key: (incident) => incident.id,
      render: (incident) => incident.message,
    },
  ];

  const deleteSelectedAdHocIncident = async (incident) => {
    console.log("Deleting");
    const response = await axios({
      method: "delete",
      url: `/api/incidents/deleteadhocincident/${incident.id}`,
    });

    const copyOfCurrentAdHoc = [...tableData];

    const filtered = copyOfCurrentAdHoc.filter(
      (item) => item.id !== incident.id
    );

    setTableData(filtered);
  };

  const renderEntryDeleteButton = (incident) => {
    return (
      <Button
        key={incident.id}
        onClick={() => {
          deleteSelectedAdHocIncident(incident);
        }}
        type="primary"
        danger
      >
        Delete
      </Button>
    );
  };

  const renderErrorMessage = () => {
    return errorMessage ? (
      <div className="alert alert-danger" role="alert">
        {errorMessage}
      </div>
    ) : (
      ""
    );
  };

  const renderSuccessMessage = (msg) => {
    return successMessage ? (
      <div className="alert alert-success" role="alert">
        {msg}
      </div>
    ) : (
      ""
    );
  };

  const renderInfoMessage = (msg) => {
    return infoMessage ? (
      <div className="alert alert-info" role="alert">
        {msg}
      </div>
    ) : (
      ""
    );
  };

  const renderCommitButton = () => {
    return (
      <input
        type="button"
        className="btn btn-sm btn-primary ml-3 align-top"
        style={{ height: "35.98px", marginLeft: "20px" }}
        value="Commit to DB"
        disabled={isCommitButtonEnabled ? "" : "OK"}
        onClick={handleCommitToDB}
      />
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setCurrentAdHocIsFetching(true);
      try {
        const { data } = await getAdHocOutages();
        setTableData(data);
        setCurrentAdHocIsFetching(false);
      } catch (error) {
        errorNotification(error.code, error.message);
      }
    };

    fetchData();
  }, []);

  console.log("render");
  return (
    <div className="row">
      <div className="col-6 border">
        <h3 className="p-2">Current Ad-Hoc Outages (Latest first)</h3>
        <div className="row">
          <div className="col-6">
            {tableData.length ? (
              <span className="mb-2 border">
                Total Entries: {tableData.length}
              </span>
            ) : (
              ""
            )}
          </div>

          <div className="col-6 text-end">
            {infoMessage && tableData.length && !errorMessage ? (
              <span className="bg-success text-white m-2 border">
                {" "}
                Added: {uploadedTableData.length} entries
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="vh-100" style={{ position: "relative" }}>
          <LoadingSpinnerCentered isFetching={currentAdHocIsFetching}>
            <Table
              dataSource={tableData}
              columns={columnsForCurrentAdHocOutages}
              rowKey="id"
              pagination={{ defaultPageSize: 15 }}
              size="small"
              style={{ marginBottom: "50px", transition: "transform 1.5s" }}
            />
          </LoadingSpinnerCentered>
        </div>
      </div>
      <div className="col-6">
        <h3 className="p-2">Upload New Excel File</h3>
        <form
          onSubmit={handlePreview}
          className="border mb-2 p-2 d-inline-block"
        >
          {/* <FileUploader
            handleChange={handleChange2}
            name="file"
            types={fileTypes}
            multiple={false}
            label="Drag your file here"
          /> */}

          <input
            type="file"
            onChange={handleFileSelect}
            style={{ height: "35.98px" }}
          />
          <input
            type="submit"
            value="Preview File"
            disabled={isPreviewButtonEnabled ? "" : "OK"}
            style={{ height: "35.98px" }}
          />
          {renderCommitButton()}
        </form>
        {successMessage && renderSuccessMessage(successMessage)}
        {errorMessage && renderErrorMessage(errorMessage)}
        {infoMessage && renderInfoMessage(infoMessage)}
        <div className="vh-100" style={{ position: "relative" }}>
          {uploadedTableData.length ? (
            <span>Total Entries: {uploadedTableData.length}</span>
          ) : (
            ""
          )}
          <LoadingSpinnerCentered isFetching={newAdHocIsFetching}>
            <Table
              dataSource={uploadedTableData}
              columns={columnsForNewAdHocOutages}
              rowKey="id"
              pagination={{ defaultPageSize: 15 }}
              size="small"
              style={{ marginBottom: "50px", transition: "transform 1.5s" }}
            />
          </LoadingSpinnerCentered>
        </div>
      </div>
    </div>
  );
}
