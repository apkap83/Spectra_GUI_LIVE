package gr.wind.FullStackSpring_Review.users;

import gr.wind.FullStackSpring_Review.exception.MyResponseStatusException;
import gr.wind.FullStackSpring_Review.auth.SpectraWebUser;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UsersDataAccessService {

    @Value("${app.TablePrefix}")
    private String TablePrefix;

    private final JdbcTemplate jdbcTemplate;

    public UsersDataAccessService(@Qualifier("jdbcTemplateForLiveDB") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate=jdbcTemplate;
    }

    public List<SpectraWebUser> selectAllUsers() {
        String sql = "SELECT " +
                "ID, " +
                "RealName, " +
                "userName, " +
                "email, " +
                "active, " +
                "password, " +
                "role " +
                "FROM " + TablePrefix + "DEV_Spectra_GUI_Users order by ID ASC";

        List<SpectraWebUser> users = jdbcTemplate.query(sql, (resultSet, i) ->{
            int id = resultSet.getInt("id");
            String realName = resultSet.getString("RealName");
            String userName = resultSet.getString("userName");
            String email = resultSet.getString("email");
            int active = resultSet.getInt("active");
            String password = resultSet.getString("password");
            String role = resultSet.getString("role");

            return new SpectraWebUser(id,realName,userName,email,active,password,role);
        });

        return users;
    }

    public void addNewUser(SpectraWebUser webUser) {
        String sql = "" +
                "INSERT INTO " +
                TablePrefix + "DEV_Spectra_GUI_Users " +
                "(`RealName`, `userName`, `email`, `active`, `password`, `role`) VALUES " +
                "(?, ?, ?, ?, ?, ?)";

        try {
            jdbcTemplate.update(sql, webUser.getRealName(), webUser.getUserName(), webUser.getEmail(), webUser.getActive(), webUser.getEncryptedPassword(), webUser.getRole());
        } catch (DuplicateKeyException e) {
            e.printStackTrace();
            throw new MyResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists");
        }
     }

    public void deleteUser(SpectraWebUser webUser) {
        String sql = "" +
                "DELETE FROM " +
                TablePrefix + "DEV_Spectra_GUI_Users " +
                "WHERE RealName = ? and UserName = ? ";

        jdbcTemplate.update(sql, webUser.getRealName(), webUser.getUserName());
    }

    public void changePasswordForUser(SpectraWebUser webUser) {
        String sql = "" +
                "UPDATE " +
                TablePrefix + "DEV_Spectra_GUI_Users " +
                "SET password = ? WHERE RealName = ? and UserName = ?";
        jdbcTemplate.update(sql, webUser.getEncryptedPassword(), webUser.getRealName(), webUser.getUserName());
    }

    public void disableUser(SpectraWebUser webUser) {
        String sql = "" +
                "UPDATE " +
                TablePrefix + "DEV_Spectra_GUI_Users " +
                "SET active = 0 WHERE RealName = ? and UserName = ?";
        jdbcTemplate.update(sql, webUser.getRealName(), webUser.getUserName());
    }

    public void enableUser(SpectraWebUser webUser) {
        String sql = "" +
                "UPDATE " +
                TablePrefix + "DEV_Spectra_GUI_Users " +
                "SET active = 1 WHERE RealName = ? and UserName = ?";
        jdbcTemplate.update(sql, webUser.getRealName(), webUser.getUserName());
    }

    public List<String> getDistinctRoles() {
        String sql = "" +
                "SELECT DISTINCT role FROM " +
                TablePrefix + "GUI_Available_Roles ORDER BY role ASC";
        List<String> roles = jdbcTemplate.query(sql, (resultSet, i) ->{
            String role = resultSet.getString("role");

            return role;
        });
        return roles;
    }

    public void updateUser(SpectraWebUser webUser) {
        String sql = "" +
                "UPDATE " +
                TablePrefix + "DEV_Spectra_GUI_Users " +
                "SET `RealName` = ?, " +
                "`password` = ?, " +
                "`role` = ?, " +
                "`active` = ? " +
                "WHERE `userName` = ?";
        System.out.println(sql);
        jdbcTemplate.update(sql, webUser.getRealName(), webUser.getEncryptedPassword(), webUser.getRole(), webUser.getActive(), webUser.getUserName());
    }

    public void updateUserRole(SpectraWebUser webUser) {
        String sql = "" +
                "UPDATE " +
                TablePrefix + "DEV_Spectra_GUI_Users " +
                "SET `Role` = ? " +
                "WHERE `userName` = ?";
        System.out.println(sql);
        jdbcTemplate.update(sql, webUser.getRole(), webUser.getUserName());
    }



//    public void updateManyUsers(List<SpectraWebUser> webUsers) {
//
//        for (SpectraWebUser user : webUsers) {
//            if (user.getRealName() != null && user.getUserName() != null) {
//
//
//            }
//        }
//
//    }
}
