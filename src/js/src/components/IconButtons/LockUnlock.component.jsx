import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

export const LockUnlock = ({ lock, handleLockUnlockIconClick }) => {
  if (!lock) {
    return <LockIcon onClick={handleLockUnlockIconClick} />;
  } else {
    return <LockOpenIcon onClick={handleLockUnlockIconClick} />;
  }
};
