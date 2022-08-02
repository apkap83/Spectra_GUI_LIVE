import { Avatar, Button } from "antd";
import React from "react";
import { Container } from "../Container";
import "./Footer.css";

const Footer = ({ numberOfStudents, handleAddStudentClickEvent }) => (
  <div className="footer">
    <Container>
      {numberOfStudents !== undefined ? (
        <Avatar
          style={{
            backgroundColor: "#f56a00",
            marginRight: "5px",
          }}
          size="medium"
        >
          {numberOfStudents}
        </Avatar>
      ) : null}
      <Button onClick={() => handleAddStudentClickEvent()} type="primary">
        Add new student
      </Button>
    </Container>
  </div>
);

export default Footer;
