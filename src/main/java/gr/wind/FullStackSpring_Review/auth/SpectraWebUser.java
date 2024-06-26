package gr.wind.FullStackSpring_Review.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class SpectraWebUser {

    private final int id;
    private final String realName;
    private final String userName;
    private final String email;
    private final int active;

    @JsonIgnore
    private final String encryptedPassword;
    private final String role;

    private PasswordEncoder passwordEncoder;

    @Autowired
    public SpectraWebUser(@JsonProperty("id") int id,
                          @JsonProperty("realName") String realName,
                          @JsonProperty("userName") String userName,
                          @JsonProperty("email") String email,
                          @JsonProperty("active") int active,
                          @JsonProperty("password") String plainPassword,
                          @JsonProperty("role")String role
                          ) {
        this.id = id;
        this.realName = realName;
        this.userName = userName;
        this.email = email;
        this.active = active;
        this.encryptedPassword = encryptPassword(plainPassword);
        this.role = role;
    }

    private String encryptPassword(String plainPassword) {
        if (plainPassword != null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            return passwordEncoder.encode(plainPassword);
        } else {
            return "";
        }

    }

    public int getId() {
        return id;
    }

    public String getRealName() {
        return realName;
    }

    public String getUserName() {
        return userName;
    }

    public String getEmail() {
        return email;
    }

    public int getActive() {
        return active;
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public String getRole() {
        return role;
    }

    @Override
    public String toString() {
        return "SpectraWebUser{" +
                "id=" + id +
                ", realName='" + realName + '\'' +
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", active=" + active +
                ", encryptedPassword='" + encryptedPassword + '\'' +
                ", role='" + role + '\'' +
                ", passwordEncoder=" + passwordEncoder +
                '}';
    }
}
