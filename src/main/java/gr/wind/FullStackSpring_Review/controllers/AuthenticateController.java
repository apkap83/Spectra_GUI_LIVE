package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.auth.ApplicationUserService;
import gr.wind.FullStackSpring_Review.model.AuthenticationRequest;
import gr.wind.FullStackSpring_Review.model.AuthenticationResponse;
import gr.wind.FullStackSpring_Review.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/")
public class AuthenticateController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    private ApplicationUserService userDetailsService;

    @CrossOrigin
    @PostMapping(path = "/authenticate", produces = "application/json")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
            );

            // Generate JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            System.out.println("userDetails" + userDetails);
            String jwt = jwtTokenUtil.generateToken(userDetails);

            return ResponseEntity.ok(new AuthenticationResponse(jwt));

        }
        catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }


//
//        final UserDetails userDetails = userDetailsService
//                .loadUserByUsername(authenticationRequest.getUsername());

//        final String jwt = jwtTokenUtil.generateToken(userDetails);

//        return ResponseEntity.ok(new AuthenticationResponse(jwt));
//        return ResponseEntity.ok(new AuthenticationResponse("Hello"));
    }
}
