import DeleteIcon from "@mui/icons-material/Delete";

export const DeleteButton = ({ user, handleDeleteIconClick }) => {
  return user.userName !== "admin" ? (
    <DeleteIcon onClick={handleDeleteIconClick} />
  ) : null;
};
