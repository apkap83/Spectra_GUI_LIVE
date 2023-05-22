import { useState, useEffect } from "react";
import {
  getAllUsersDetails,
  getAllAvailableRoles,
  addUser,
  updateUser,
  deleteUser,
} from "../../services/userService";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import LoadingSpinnerCentered from "./../Spinner/LoadingSpinnerCentered.component";

import "./users.scss";

export const Users = () => {
  const initialEmptyUser = {
    userName: "",
    realName: "",
    password: "",
  };

  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState();

  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(initialEmptyUser);
  const [newUserMode, setNewUserMode] = useState(false);

  const [userName, setUserName] = useState("");
  const [realName, setRealName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const user = {
    userName,
    realName,
    password,
    role: selectedRole,
    active: 1,
  };

  useEffect(() => {
    const getUsers = async () => {
      setIsFetchingUsers(true);
      const { data: users } = await getAllUsersDetails();
      const { data: roles } = await getAllAvailableRoles();
      setUsers(users);
      setAvailableRoles(roles);
      setIsFetchingUsers(false);
    };
    console.log("selectedUser = ", selectedUser);
    getUsers();
  }, []);

  useEffect(() => {
    setPasswordsMatch(password === repeatPassword);
  }, [repeatPassword]);

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
  return (
    <div className="users">
      <div
        className="users__left"
        style={{
          position: "relative",
          border: "1px solid rgba(0,0,0,0.2)",
        }}
      >
        <h4 className="users__header">Spectra Users</h4>
        <LoadingSpinnerCentered isFetching={isFetchingUsers}>
          <List className="users__list" style={{ marginBottom: "200px" }}>
            {users.map((user, index) => {
              const isSelected = user === selectedUser;
              return (
                <ListItem
                  disablePadding
                  sx={{ backgroundColor: isSelected ? "lightblue" : "inherit" }}
                  onClick={() => handleUserClick(user)}
                  key={user.id}
                >
                  <ListItemButton>
                    <PersonIcon></PersonIcon> &nbsp;
                    <ListItemText primary={user.realName} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </LoadingSpinnerCentered>
      </div>

      <div className="users__right">
        <FormGroup
          sx={{
            height: "80vh",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
            }}
          >
            <Button
              variant="contained"
              disabled={newUserMode === true}
              color="warning"
              sx={{ width: "25%", marginBottom: "20px", marginTop: "10px" }}
              onClick={() => handleNewUser()}
            >
              New User
            </Button>
            <Button
              variant="contained"
              disabled={newUserMode === true || selectedUser.userName === ""}
              color="error"
              sx={{ width: "25%", marginBottom: "20px", marginTop: "10px" }}
              onClick={() => handleDeleteUser()}
            >
              Delete User
            </Button>
          </div>

          <label htmlFor="userName">User Name:</label>
          <input
            disabled={!newUserMode}
            id="userName"
            type="text"
            style={{ width: "50%", marginBottom: "20px", marginTop: "10px" }}
            value={userName}
            onChange={handleChange}
          />

          <label htmlFor="realName">Real Name:</label>
          <input
            id="realName"
            type="text"
            style={{ width: "50%", marginBottom: "20px", marginTop: "10px" }}
            value={realName}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            style={{ width: "50%", marginBottom: "20px", marginTop: "10px" }}
            value={password}
            onChange={handleChange}
          />

          <label htmlFor="repeat_password">Repeat Password</label>
          <input
            id="repeat_password"
            type="password"
            style={{
              borderColor: !passwordsMatch ? "red" : "black",
              outline: "none",
              width: "50%",
              marginBottom: "20px",
              marginTop: "10px",
            }}
            value={repeatPassword}
            onChange={handleChange}
          />
          {/* Additional validation error message if passwords don't match */}
          {!passwordsMatch && (
            <p
              style={{
                color: "red",
                marginTop: "-20px",
                marginBottom: "10pxs",
              }}
            >
              Passwords do not match.
            </p>
          )}

          <label htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            style={{ width: "50%", marginBottom: "20px", marginTop: "10px" }}
            value={selectedRole}
            onChange={handleSelectRoleChange}
          >
            <option></option>
            {availableRoles.map((role, id) => {
              return (
                <option
                  key={id}
                  value={role}
                  //   selected={role === selectedUser.role}
                >
                  {role}
                </option>
              );
            })}
          </select>

          {/* <FormControlLabel
            control={
              <Switch
                onChange={handleSwitchChange}
                checked={selectedUser?.active}
              />
            }
            label="User Enabled"
          /> */}

          <Button
            variant="contained"
            color="success"
            sx={{ width: "50%", marginBottom: "20px", marginTop: "10px" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </FormGroup>
      </div>
    </div>
  );
};
