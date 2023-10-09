import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { Layout } from "antd";
const { Footer } = Layout;
import { ReactComponent as NovaLogo } from "../../assets/novaLogo.svg";
import { getCurrentYear } from "../../utils/myutils";

const footerClass =
  "p-1 bg-dark border-top border-2 border-secondary text-white d-flex flex-column justify-content-center align-items-center fixed-bottom";

export const MyFooter = () => {
  const userDetails = useContext(UserContext);
  return (
    <>
      {window.location.pathname !== "/login" && userDetails && (
        <Footer className={footerClass}>
          <NovaLogo style={{ width: "110px" }} fill="white" stroke="black" />
          <span className="nmsTeam">NMS Team {getCurrentYear()}</span>
        </Footer>
      )}
    </>
  );
};
