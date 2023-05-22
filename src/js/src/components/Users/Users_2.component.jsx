import { useState, useEffect } from "react";
import {
  getAllUsersDetails,
  getAllAvailableRoles,
  addUser,
  updateUser,
  deleteUser,
} from "../../services/userService";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// MUI Lib Imports
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyIcon from "@mui/icons-material/Key";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import LoadingSpinnerCentered from "./../Spinner/LoadingSpinnerCentered.component";
import { MyLoadingSpinner } from "../Spinner/MyLoadingSpinner.component";

import { PaginationAndTotalRecords } from "../common/PaginationAndTotalRecords.component";
import { paginate } from "../../utils/paginate";

import { TableCell } from "@mui/material";
import {
  successNotification,
  errorNotification,
} from "../../common/Notification";

import "./users.scss";
export const Users_2 = () => {
  const pageSize = 10;
  const initialEmptyUser = {
    userName: "",
    realName: "",
    password: "",
  };

  const [users, setUsers] = useState([]);
  const [createUserFormVisible, setCreateUserFormVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState();

  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(initialEmptyUser);
  const [newUserMode, setNewUserMode] = useState(false);

  const [userName, setUserName] = useState("");
  const [realName, setRealName] = useState("");
  const [password, setPassword] = useState("");

  const user = {
    userName,
    realName,
    password,
    role: selectedRole,
    active: 1,
  };

  const getUsersAndRoles = async () => {
    setIsFetchingUsers(true);
    const { data: users } = await getAllUsersDetails();
    const { data: roles } = await getAllAvailableRoles();
    setUsers(users);
    setAvailableRoles(roles);
    setIsFetchingUsers(false);
  };
  useEffect(() => {
    getUsersAndRoles();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUserName(user.userName);
    setRealName(user.realName);
    setPassword(user.userName);
    setRepeatPassword(user.userName);
    setSelectedRole(user.role);
    setNewUserMode(false);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    console.log(id);
    switch (id) {
      case "userName":
        setUserName(value);
        break;
      case "realName":
        setRealName(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "repeat_password":
        setRepeatPassword(value);
        break;
      case "role":
        setRole(value);
        break;
    }
  };

  const handleNewUser = (event) => {
    setNewUserMode(true);
    setSelectedUser(initialEmptyUser);
    setUserName("");
    setRealName("");
    setPassword("");
    setRepeatPassword("");
    setSelectedRole("");
  };

  const handleSwitchChange = (event) => {
    setUserIsEnabled(!userIsEnabled);
  };

  const handleSelectRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleDeleteUser = async () => {
    await deleteUser(user);
  };

  const handleSubmit = async () => {
    if (newUserMode) {
      await addUser(user);
    } else {
      await updateUser(user);
      console.log("Update User!");
    }
  };

  const generateTableHeadAndColumns = (columnsArray) => {
    return (
      <TableHead>
        <TableRow>
          {columnsArray.map((item, id) => (
            <TableCell key={id} align="left">
              {item}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const columnsForOpenSpectraIncidents = [
    "ID",
    "Real Name",
    "User Name",
    "Active",
    "Role",
    "Actions",
  ];

  const TableBodyForIncidents = (rows) => {
    return (
      <>
        <TableBody>
          {rows.map((user) => {
            return (
              <TableRow
                key={user.id}
                className="myRow"
                sx={{
                  backgroundColor:
                    user.active === 1 ? "#9ae6b445" : "#feb2b245",
                }}
              >
                <TableCell align="left" component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {user.realName}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {user.userName}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {user.active == 1 ? "Yes" : "No"}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {user.role}
                </TableCell>
                <TableCell>
                  <div className="menu_icons">
                    <KeyIcon />
                    {user.active === 1 ? <LockOpenIcon /> : <LockIcon />}
                    {user.userName !== "admin" ? <DeleteIcon /> : ""}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </>
    );
  };

  const handleCreateUserBtn = () => {
    setCreateUserFormVisible((prev) => !prev);
  };

  const CreateUserForm = () => {
    const validationSchema = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      username: Yup.string().required("User name is required"),
      password: Yup.string().required("Password is required"),
      repeat_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Repeat Password is required"),
      role: Yup.string().required("Role is required"),
    });

    return (
      <div className="newUserForm">
        <h1>Create New Spectra User Form</h1>
        <Formik
          initialValues={{
            name: "",
            username: "",
            password: "",
            repeat_password: "",
            role: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(async () => {
              // alert(JSON.stringify(values, null, 2));

              try {
                await addUser({
                  realName: values.name,
                  userName: values.username,
                  password: values.password,
                  active: 1,
                  role: values.role,
                });

                values.name = "";
                values.username = "";
                values.password = "";
                values.repeat_password = "";
                values.role = "";
                successNotification("User successfully created");

                getUsersAndRoles();
              } catch (error) {
                errorNotification("Error during user creation");
              }

              setSubmitting(false);
            }, 400);
          }}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="newUserForm__formField">
                <label className="newUserForm__formField__label" htmlFor="name">
                  Name
                </label>
                <Field
                  className="newUserForm__formField__input"
                  type="text"
                  name="name"
                />
                <ErrorMessage
                  name="name"
                  className="newUserForm__formField__error"
                  component="div"
                />
              </div>
              <div className="newUserForm__formField">
                <label
                  className="newUserForm__formField__label"
                  htmlFor="username"
                >
                  User Name
                </label>
                <Field
                  className="newUserForm__formField__input"
                  type="text"
                  name="username"
                />
                <ErrorMessage
                  name="username"
                  className="newUserForm__formField__error"
                  component="div"
                />
              </div>
              <div className="newUserForm__formField">
                <label
                  className="newUserForm__formField__label"
                  htmlFor="password"
                >
                  Password
                </label>
                <Field
                  className="newUserForm__formField__input"
                  type="password"
                  name="password"
                />
                <ErrorMessage
                  name="password"
                  className="newUserForm__formField__error"
                  component="div"
                />
              </div>
              <div className="newUserForm__formField">
                <label
                  className="newUserForm__formField__label"
                  htmlFor="repeat_password"
                >
                  Repeat Password
                </label>
                <Field
                  className="newUserForm__formField__input"
                  type="password"
                  name="repeat_password"
                />
                <ErrorMessage
                  name="repeat_password"
                  className="newUserForm__formField__error"
                  component="div"
                />
              </div>
              <div className="newUserForm__formField">
                <label className="newUserForm__formField__label" htmlFor="role">
                  Role
                </label>
                <Field
                  className="newUserForm__formField__input"
                  type="text"
                  name="role"
                />
                <ErrorMessage
                  name="role"
                  className="newUserForm__formField__error"
                  component="div"
                />
              </div>
              <div className="newUserForm__submit">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  className="newUserForm__submit__btn"
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  };

  const handlePageChange = (e, value) => {
    setPageNumber(value);
  };

  const getPagedData = () => {
    let filtered = users;
    return paginate(filtered, pageNumber, pageSize);
  };

  const pagesCount = users && Math.ceil(users.length / pageSize);
  let paginatedList = getPagedData();

  return (
    <>
      <div className="user_menu_buttons">
        <Button
          variant="contained"
          onClick={handleCreateUserBtn}
          className={createUserFormVisible ? "createUserToggleBtnPressed" : ""}
        >
          Create User
        </Button>
        {isFetchingUsers ? <MyLoadingSpinner /> : null}
        {/* <MyLoadingSpinner /> */}
      </div>
      <h3 style={{ margin: "10px" }}>Spectra Users List</h3>
      {createUserFormVisible ? <CreateUserForm /> : null}

      <Table
        sx={{ minWidth: 650, position: "relative" }}
        size="large"
        aria-label="a table"
      >
        {generateTableHeadAndColumns(columnsForOpenSpectraIncidents)}
        {/* <LoadingSpinnerCentered isFetching={true}> */}

        {TableBodyForIncidents(paginatedList)}
        {/* </LoadingSpinnerCentered> */}
      </Table>
      <PaginationAndTotalRecords
        recordsNumber={users && users.length}
        pageNumber={pageNumber}
        pagesCount={pagesCount}
        handlePageChange={handlePageChange}
      />
    </>
  );
};
