import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

export const LockUnlock = ({ user, lock, handleLockUnlockIconClick }) => {
  if (user.userName !== "admin") {
    if (lock) {
      return <LockOpenIcon onClick={handleLockUnlockIconClick} />;
    } else {
      return <LockIcon onClick={handleLockUnlockIconClick} />;
    }
  } else {
    return null;
  }
};
