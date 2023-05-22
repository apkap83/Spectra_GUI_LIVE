package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.model.SpectraWebUser;
import gr.wind.FullStackSpring_Review.users.UsersService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/users")
public class UsersController {

    private String userNameLoggedIn;

    @Value("${app.MyEnvironmentDescription}")
    private String Environment;

    private final UsersService usersService;

    @Autowired
    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    private static final Logger logger = LogManager.getLogger(IncidentController.class);

    @CrossOrigin
    @GetMapping(path = "/getalluserdetails", produces = "application/json")
    public List<SpectraWebUser> getAllUsers() {
        System.out.println("HERE");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET all User Details");

        return usersService.getAllUserDetails();
    }

    @CrossOrigin
    @PostMapping(path = "/addnewuser", produces = "application/json")
    public void addNewUser(@Valid @RequestBody SpectraWebUser webUser ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Add User " + webUser.toString());

        usersService.addNewUser(webUser);
    }

    @CrossOrigin
    @PostMapping(path = "/updateuser", produces = "application/json")
    public void updateUser(@Valid @RequestBody SpectraWebUser webUser ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Update User " + webUser.toString());

        usersService.updateUser(webUser);
    }


    @CrossOrigin
    @PostMapping(path = "/deleteuser", produces = "application/json")
    public void deleteUser(@Valid @RequestBody SpectraWebUser webUser ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Delete User " + webUser.toString());

        usersService.deleteUser(webUser);
    }


    @CrossOrigin
    @PostMapping(path = "/changeuserpassword", produces = "application/json")
    public void changePasswordForUser(@Valid @RequestBody SpectraWebUser webUser ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Change User Password " + webUser.toString());

        usersService.changePasswordForUser(webUser);
    }

    @CrossOrigin
    @PostMapping(path = "/disableuser", produces = "application/json")
    public void disableUser(@Valid @RequestBody SpectraWebUser webUser ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Disable User " + webUser.toString());

        usersService.disableUser(webUser);
    }

    @CrossOrigin
    @PostMapping(path = "/enableuser", produces = "application/json")
    public void enableUser(@Valid @RequestBody SpectraWebUser webUser ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Enable User " + webUser.toString());

        usersService.enableUser(webUser);
    }


    @CrossOrigin
    @GetMapping(path = "/getdistinctroles", produces = "application/json")
    public List<String> getDistinctRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET distinct user roles");

        return usersService.getDistinctRoles();
    }

//    @CrossOrigin
//    @PostMapping(path = "/updateManyUsers", produces = "application/json")
//    public void updateManyUsers(@Valid @RequestBody List<SpectraWebUser> webUsers ) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        userNameLoggedIn = authentication.getName();
//        logger.info(Environment + " " + userNameLoggedIn + " -> GET all User Details");
//
//        usersService.updateManyUsers(webUsers);
//    }

}
