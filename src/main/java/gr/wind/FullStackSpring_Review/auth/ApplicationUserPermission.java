package gr.wind.FullStackSpring_Review.auth;

public enum ApplicationUserPermission {
    USER_CAN_DISABLE_PUBLISHING("user:candisable:publishing"),
    USER_CAN_ALTER_MESSAGE("user:canalter:message"),
    USER_CAN_ALTER_BACKUP_POLICY("user:canalter_backup_policy"),
    USER_CAN_DOWNLOAD_FILES("user:candownload:files"),
    USER_CAN_UPLOAD_ADHOC("user:canupload:adhocmessage"),
    USER_CAN_MANAGE_USERS("user:canmanage:users");

    private final String permission;

    ApplicationUserPermission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }
}
