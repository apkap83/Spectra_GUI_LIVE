package gr.wind.FullStackSpring_Review.security;

public enum ApplicationUserPermission {
    USER_READS("user:reads"),
    USER_WRITES("user:writes");

    private final String permission;

    ApplicationUserPermission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }
}
