import { useState, useEffect, useRef, useMemo } from "react";
import {
  getAllUsersDetails,
  getAllAvailableRoles,
  addUser,
  updateUser,
  updateUserRole,
  deleteUser,
  enableUser,
  disableUser,
} from "../../services/userService";
import { PasswordResetButton } from "../IconButtons/Password.component";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// MUI Lib Imports
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Button from "@mui/material/Button";
import { DeleteButton } from "../IconButtons/Delete.component";
import { LockUnlock } from "../IconButtons/LockUnlock.component";

import LoadingSpinnerCentered from "../Spinner/LoadingSpinnerCentered.component";

import { PaginationAndTotalRecords } from "../common/PaginationAndTotalRecords.component";
import { paginate } from "../../utils/paginate";

import { TableCell } from "@mui/material";
import {
  successNotification,
  errorNotification,
} from "../../common/Notification";

import { UserSelector } from "../common/UserSelector.component";

import "./users.scss";
import { filter } from "lodash";
export const Users = () => {
  const pageSize = 10;
  const initialEmptyUser = {
    userName: "",
    realName: "",
    password: "",
  };

  function useDelayUnmount(isMounted, delayTime) {
    const [showDiv, setShowDiv] = useState(false);

    useEffect(() => {
      let timeoutId;
      if (isMounted && !showDiv) {
        timeoutId = setTimeout(() => setShowDiv(true), delayTime); //delay our unmount
      } else if (!isMounted && showDiv) {
        timeoutId = setTimeout(() => setShowDiv(false), delayTime); //delay our unmount
      }
      return () => clearTimeout(timeoutId); // cleanup mechanism for effects , the use of setTimeout generate a sideEffect
    }, [isMounted, delayTime, showDiv]);

    return showDiv;
  }

  // How to use Conditional Rendering with Animation in React
  // https://dev.to/oussel/how-to-use-conditional-rendering-with-animation-in-react-1k20
  const mountedStyle = {
    animation: "showAnimation 250ms ease-in",
  };
  const unmountedStyle = { animation: "unShowAnimation 250ms ease-in" };
  // animation: "unShowAnimation 500ms ease-out",
  // animationFillMode: "forwards",

  const [users, setUsers] = useState([]);
  const [retrievedUsers, setRetrievedUsers] = useState([]);
  const [createUserFormVisible, setCreateUserFormVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const [filteredUserName, setFilteredUserName] = useState("");

  const [selectedIndividualRole, setSelectedIndividualRole] = useState("");

  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(initialEmptyUser);
  const [newUserMode, setNewUserMode] = useState(false);

  const [userName, setUserName] = useState("");
  const [realName, setRealName] = useState("");
  const [password, setPassword] = useState("");

  const showDiv = useDelayUnmount(createUserFormVisible, 100);

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
    setRetrievedUsers(users);
    setAvailableRoles(roles);
    setIsFetchingUsers(false);
  };
  useEffect(() => {
    getUsersAndRoles();
  }, []);

  // Filtering of Users
  useEffect(() => {
    setPageNumber(1);

    let filteredAll = retrievedUsers;

    if (filteredUserName && filteredUserName.length > 0) {
      filteredAll = filteredAll.filter((users) =>
        users.userName
          .toLowerCase()
          .includes(filteredUserName.toLocaleLowerCase())
      );
      setUsers(filteredAll);
    } else {
      setUsers(retrievedUsers);
    }
  }, [filteredUserName]);

  const handleSwitchChange = (event) => {
    setUserIsEnabled(!userIsEnabled);
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

  const columnsForUsersList = [
    "ID",
    "Real Name",
    <UserSelector
      setFilteredUserName={setFilteredUserName}
      filteredUserName={filteredUserName}
    />,
    "E-mail",
    "Active",
    "Role",
    "Actions",
  ];

  const handleLockUnlockIconClick = async (user) => {
    try {
      let messageEnableDisable = user.active === 1 ? "disabled" : "enabled";
      user.active === 1 ? await disableUser(user) : await enableUser(user);

      successNotification(`User ${messageEnableDisable} successfully`);

      let usersCopy = [...users];

      const newCopy = usersCopy.map((obj) => {
        if (obj === user) {
          return { ...obj, active: obj.active === 1 ? 0 : 1 };
        }
        return obj;
      });

      setUsers(newCopy);
    } catch (err) {
      errorNotification("Error performing action", err.msg);
    }
  };

  const handleDeleteIconClick = async (user) => {
    try {
      const isAdminSure = window.confirm(
        `Are you sure you want to delete user ${user.realName} ?`
      );
      if (isAdminSure) {
        await deleteUser(user);
        let usersCopy = [...users];

        const newCopy = usersCopy.filter((item) => item.id !== user.id);

        setUsers(newCopy);
        successNotification(`User ${user.realName} deleted successfully`);
      } else {
        // Cancel or handle the user's decision
      }
    } catch (error) {
      errorNotification("Error performing action", err.msg);
    }
  };

  const SelectElement = ({ user }) => {
    return (
      <select
        name="role"
        value={user.role}
        onChange={(e) => handleChangeForExistingUserRole(e, user)}
        style={{
          backgroundColor: "transparent",
          // border: "none",
          padding: "5px",
        }}
      >
        {availableRoles.map((role, id) => {
          if (user.userName === "admin") {
            return null;
          }
          return (
            <option key={id} value={role}>
              {role}
            </option>
          );
        })}
      </select>
    );
  };

  const MyTableBody = (rows) => {
    return (
      <>
        <TableBody>
          {rows.map((user, id) => {
            return (
              <TableRow
                key={id}
                className="myRow"
                sx={{
                  backgroundColor:
                    user.active === 1 ? "#9ae6b445" : "#feb2b245",
                }}
              >
                <TableCell align="left" component="th" scope="row">
                  {(pageNumber - 1) * pageSize + id + 1}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {user.realName}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {user.userName}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {user.email}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {user.active == 1 ? "Yes" : "No"}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {user.userName === "admin" ? (
                    <span style={{ padding: "10px" }}>ADMIN</span>
                  ) : (
                    <SelectElement user={user} />
                  )}
                </TableCell>
                <TableCell>
                  <div className="menu_icons">
                    <PasswordResetButton user={user} />
                    <LockUnlock
                      user={user}
                      lock={user.active}
                      handleLockUnlockIconClick={() =>
                        handleLockUnlockIconClick(user)
                      }
                    />
                    <DeleteButton
                      user={user}
                      handleDeleteIconClick={() => handleDeleteIconClick(user)}
                    />
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
    setSelectedRole("");
    setCreateUserFormVisible((prev) => !prev);
  };

  const handleChangeForExistingUserRole = async (e, user) => {
    try {
      updateUserRole({
        userName: user.userName,
        role: e.target.value,
      });

      let usersCopy = [...users];

      const newCopy = usersCopy.map((obj) => {
        if (obj === user) {
          console.log("found");
          return { ...obj, role: e.target.value };
        }
        return obj;
      });

      setUsers(newCopy);
      successNotification("User role successfully updated");
    } catch (error) {
      errorNotification("User role could be updated");
    }
  };

  const CreateUserForm = ({ style }) => {
    const validationSchema = Yup.object().shape({
      name: Yup.string().required("Real Name is required"),
      username: Yup.string().required("User name is required"),
      email: Yup.string().required("Email is required"),
      password: Yup.string().required("Password is required"),
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{15,}$/,
      //   "Password must be at least 15 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      // ),
      repeat_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Repeat Password is required"),
      role: Yup.string().required("Role is required"),
    });
    let myStyle = style;

    if (createUserFormVisible === true) {
      myStyle = {};
    }

    return (
      <div className="newUserForm" style={myStyle}>
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
                  email: values.email,
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
              } finally {
                setSubmitting(false);
              }
            }, 400);
          }}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="newUserForm__formField">
                {/* <label className="newUserForm__formField__label" htmlFor="name">
                  Real Name (Surname first)
                </label> */}
                <Field
                  className="newUserForm__input"
                  type="text"
                  name="name"
                  placeholder="Real Name (Surname first)"
                />
                <ErrorMessage
                  name="name"
                  className="newUserForm__formField__error"
                  component="div"
                />
              </div>
              <div className="newUserForm__formField">
                {/* <label
                  className="newUserForm__formField__label"
                  htmlFor="username"
                >
                  User Name
                </label> */}
                <Field
                  className="newUserForm__input"
                  type="text"
                  name="username"
                  placeholder="User Name"
                />
                <ErrorMessage
                  name="username"
                  className="newUserForm__formField__error"
                  component="div"
                />
              </div>
              <div className="newUserForm__formField">
                {/* <label
                  className="newUserForm__formField__label"
                  htmlFor="username"
                >
                  User Name
                </label> */}
                <Field
                  className="newUserForm__input"
                  type="text"
                  name="email"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  className="newUserForm__formField__error"
                  component="div"
                />
              </div>
              <div className="newUserForm__formField">
                {/* <label
                  className="newUserForm__formField__label"
                  htmlFor="password"
                >
                  Password
                </label> */}
                <Field
                  className="newUserForm__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  className="newUserForm__formField__error"
                  component="div"
                />
              </div>
              <div className="newUserForm__formField">
                {/* <label
                  className="newUserForm__formField__label"
                  htmlFor="repeat_password"
                >
                  Repeat Password
                </label> */}
                <Field
                  className="newUserForm__input"
                  type="password"
                  name="repeat_password"
                  placeholder="Repeat Password"
                />
                <ErrorMessage
                  name="repeat_password"
                  className="newUserForm__formField__error"
                  component="div"
                />
              </div>
              <div className="newUserForm__formField">
                {/* <label className="newUserForm__formField__label" htmlFor="role">
                  Role
                </label> */}
                <Field
                  className="newUserForm__input newUserForm__input--select"
                  as="select"
                  name="role"
                >
                  <option value="" disabled hidden>
                    Select Role
                  </option>
                  {availableRoles.map((role, id) => {
                    return (
                      <option key={id} value={role}>
                        {role}
                      </option>
                    );
                  })}
                </Field>
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
          className={
            createUserFormVisible
              ? "createUserToggleBtnPressed"
              : "createUserBtn"
          }
        >
          Create User
        </Button>
      </div>
      <h3 style={{ fontSize: "1.8rem", fontWeight: 600, margin: "10px" }}>
        Spectra Users List
      </h3>
      {showDiv ? (
        <CreateUserForm
          style={createUserFormVisible ? mountedStyle : unmountedStyle}
        />
      ) : null}
      <div style={{ position: "relative", height: "60vh", zIndex: "10" }}>
        <LoadingSpinnerCentered isFetching={isFetchingUsers}>
          <Table
            sx={{
              margin: "auto",
              minWidth: 650,
              position: "relative",
              width: "98.5vw",
            }}
            size="large"
            aria-label="a table"
          >
            {generateTableHeadAndColumns(columnsForUsersList)}

            {MyTableBody(paginatedList)}
          </Table>
          <PaginationAndTotalRecords
            recordsNumber={users && users.length}
            pageNumber={pageNumber}
            pagesCount={pagesCount}
            handlePageChange={handlePageChange}
          />
        </LoadingSpinnerCentered>
      </div>
    </>
  );
};
