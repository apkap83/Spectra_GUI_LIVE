/*
    USER_CAN_DISABLE_PUBLISHING("user:candisable:publishing"),
    USER_CAN_ALTER_MESSAGE("user:canalter:message"),
    USER_CAN_ALTER_BACKUP_POLICY("user:canalter_backup_policy"),
    USER_CAN_DOWNLOAD_FILES("user:candownload:files"),
    USER_CAN_UPLOAD_ADHOC("user:canupload:adhocmessage");
*/

export enum PERMISSION {
  USER_CAN_MANAGE_USERS = "user:canmanage:users",
  USER_CAN_DISABLE_PUBLISHING = "user:candisable:publishing",
  USER_CAN_ALTER_MESSAGE = "user:canalter:message",
  USER_CAN_ALTER_BACKUP_POLICY = "user:canalter_backup_policy",
  USER_CAN_DOWNLOAD_FILES = "user:candownload:files",
  USER_CAN_UPLOAD_ADHOC = "user:canupload:adhocmessage",
}
