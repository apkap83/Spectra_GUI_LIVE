import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import KeyIcon from "@mui/icons-material/Key";

import { changeUserPassword } from "../../services/userService";
import {
  successNotification,
  errorNotification,
} from "../../common/Notification";

import "./password.scss";

export const PasswordResetButton = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (values) => {
    const userDetails = {
      realName: user.realName,
      userName: user.userName,
      password: values.newPassword,
    };
    try {
      await changeUserPassword(userDetails);
      successNotification(`Password changed for user ${user.realName}`);
    } catch (error) {
      successNotification(
        `Error during changing password for user ${user.realName}`
      );
    }
    setShowPopup(false);
  };

  const handleCancel = () => {
    // Close the popup or perform any other cancel logic
    setShowPopup(false);
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords do not match")
      .required("Required"),
  });

  return (
    <div>
      <KeyIcon onClick={() => setShowPopup(true)} />

      {showPopup && (
        <div className="popup">
          <h4>Reset password for user {user.realName}</h4>
          <Formik
            initialValues={{ newPassword: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Field
                type="password"
                name="newPassword"
                placeholder="New Password"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="error"
              />

              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="popup__error"
              />

              <div className="popup__btns">
                <Button
                  className="popup__btn"
                  variant="contained"
                  type="submit"
                >
                  Reset
                </Button>
                <Button
                  className="popup__btn"
                  variant="contained"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </div>
  );
};
