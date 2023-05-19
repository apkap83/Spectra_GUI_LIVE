package gr.wind.FullStackSpring_Review.users;

import gr.wind.FullStackSpring_Review.model.SpectraWebUser;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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
                "active, " +
                "password, " +
                "role " +
                "FROM " + TablePrefix + "DEV_Spectra_GUI_Users order by ID ASC";

        List<SpectraWebUser> users = jdbcTemplate.query(sql, (resultSet, i) ->{
            int id = resultSet.getInt("id");
            String realName = resultSet.getString("RealName");
            String userName = resultSet.getString("userName");
            int active = resultSet.getInt("active");
            String password = resultSet.getString("password");
            String role = resultSet.getString("role");

            return new SpectraWebUser(id,realName,userName,active,password,role);
        });

        return users;
    }

    public void addNewUser(SpectraWebUser webUser) {
        String sql = "" +
                "INSERT INTO " +
                TablePrefix + "DEV_Spectra_GUI_Users " +
                "(RealName, userName, active, password, role) VALUES " +
                "(?, ?, ?, ?, ?)";

       jdbcTemplate.update(sql, webUser.getRealName(), webUser.getUserName(), webUser.getActive(), webUser.getEncryptedPassword(), webUser.getRole());
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
}
