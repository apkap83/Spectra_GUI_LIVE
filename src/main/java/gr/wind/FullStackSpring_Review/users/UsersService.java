package gr.wind.FullStackSpring_Review.users;

import gr.wind.FullStackSpring_Review.model.SpectraWebUser;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {

    private final UsersDataAccessService usersDataAccessService;

    public UsersService(UsersDataAccessService usersDataAccessService) {
        this.usersDataAccessService = usersDataAccessService;
    }


    public List<SpectraWebUser> getAllUserDetails() {
        return this.usersDataAccessService.selectAllUsers();
    }

    public void addNewUser(SpectraWebUser webUser) {
        this.usersDataAccessService.addNewUser(webUser);
    }

    public void deleteUser(SpectraWebUser webUser) {
        this.usersDataAccessService.deleteUser(webUser);
    }

    public void changePasswordForUser(SpectraWebUser webUser) {
        this.usersDataAccessService.changePasswordForUser(webUser);
    }


    public void disableUser(SpectraWebUser webUser) {
        this.usersDataAccessService.disableUser(webUser);
    }

    public void enableUser(SpectraWebUser webUser) {
        this.usersDataAccessService.enableUser(webUser);
    }

    public List<String> getDistinctRoles() {
        return this.usersDataAccessService.getDistinctRoles();
    }

    public void updateUser(SpectraWebUser webUser) {
        this.usersDataAccessService.updateUser(webUser);
    }

//    public void updateManyUsers(List<SpectraWebUser> webUsers) {
//        this.usersDataAccessService.updateManyUsers(webUsers);
//    }
}
