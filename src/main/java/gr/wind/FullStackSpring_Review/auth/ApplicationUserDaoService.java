package gr.wind.FullStackSpring_Review.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Optional;

@Repository("UserRepoFromDatabase")
public class ApplicationUserDaoService implements ApplicationUserDao {
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Value("${app.TablePrefix}")
    private String TablePrefix;

    @Autowired
    public ApplicationUserDaoService(PasswordEncoder passwordEncoder, @Qualifier("jdbcTemplateForLiveDB") JdbcTemplate jdbcTemplate) {
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<ApplicationUser> selectApplicationUserByUsername(String username) {
        return getApplicationUsers()
                .stream()
                .filter(applicationUser -> username.equals(applicationUser.getUsername()))
                .findFirst();
    }

    private List<ApplicationUser> getApplicationUsers() {

        // Theses are in Memory - Below is the implementation from DB
        /*
        List<ApplicationUser> applicationUsers = Lists.newArrayList(
                new ApplicationUser(
                        "annasmith",
                        passwordEncoder.encode("password"),
                        USER_RW.getGrantedAuthorities(),
                        true,
                        true,
                        true,
                        true
                ),
                new ApplicationUser(
                        "linda",
                        passwordEncoder.encode("password"),
                        USER_RW.getGrantedAuthorities(),
                        true,
                        true,
                        true,
                        true
                ),
                new ApplicationUser(
                        "tom",
                        passwordEncoder.encode("password"),
                        USER_RW.getGrantedAuthorities(),
                        true,
                        true,
                        true,
                        true
                )
        );
        */

        String sqlQuery = "SELECT " +
                "userName, " +
                "email, " +
                "active, " +
                "password, " +
                "role " +
                "FROM " + TablePrefix + "Spectra_GUI_Users";

        List<ApplicationUser> appUsers = jdbcTemplate.query(sqlQuery, (resultSet, i) -> {
            String userName = resultSet.getString("userName");
            String email = resultSet.getString("email");
            Boolean active = resultSet.getBoolean("active");
            String password = resultSet.getString("password");
            String role = resultSet.getString("role");

            return new ApplicationUser(userName, email, password, ApplicationUserRole.valueOf(role).getGrantedAuthorities(), true, true, true, active);

        });



        return appUsers;
    }

}
