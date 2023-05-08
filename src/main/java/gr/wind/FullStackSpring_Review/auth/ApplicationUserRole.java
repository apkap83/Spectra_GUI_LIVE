package gr.wind.FullStackSpring_Review.auth;

import com.google.common.collect.Sets;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;

import static gr.wind.FullStackSpring_Review.auth.ApplicationUserPermission.*;

public enum ApplicationUserRole {
    USER_RO(Sets.newHashSet()),
    POWER_USER(Sets.newHashSet(USER_CAN_DISABLE_PUBLISHING, USER_CAN_ALTER_MESSAGE, USER_CAN_ALTER_BACKUP_POLICY, USER_CAN_DOWNLOAD_FILES, USER_CAN_UPLOAD_ADHOC)),
    USER_RO_WITH_DOWNLOAD_CAPABILITY(Sets.newHashSet(USER_CAN_DOWNLOAD_FILES)),
    ADMIN(Sets.newHashSet(USER_CAN_MANAGE_USERS, USER_CAN_DISABLE_PUBLISHING, USER_CAN_ALTER_MESSAGE, USER_CAN_ALTER_BACKUP_POLICY, USER_CAN_DOWNLOAD_FILES, USER_CAN_UPLOAD_ADHOC));

    private final Set<ApplicationUserPermission> permissions;

    ApplicationUserRole(Set<ApplicationUserPermission> permissions) {
        this.permissions = permissions;
    }

    public Set<ApplicationUserPermission> getPermissions() {
        return permissions;
    }

    public Set<SimpleGrantedAuthority> getGrantedAuthorities() {
        Set<SimpleGrantedAuthority> permissions = getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toSet());
        permissions.add(new SimpleGrantedAuthority("ROLE_" + this.name()));


        return permissions;
    }
}
