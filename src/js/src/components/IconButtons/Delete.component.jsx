import DeleteIcon from "@mui/icons-material/Delete";

export const DeleteButton = ({ user, handleDeleteIconClick }) => {
  return user.userName !== "admin" ? (
    <DeleteIcon fontSize="large" onClick={handleDeleteIconClick} />
  ) : null;
};
