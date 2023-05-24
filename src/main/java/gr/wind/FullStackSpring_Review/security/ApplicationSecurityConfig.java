package gr.wind.FullStackSpring_Review.security;

import gr.wind.FullStackSpring_Review.auth.ApplicationUserPermission;
import gr.wind.FullStackSpring_Review.auth.ApplicationUserRole;
import gr.wind.FullStackSpring_Review.auth.ApplicationUserService;
import gr.wind.FullStackSpring_Review.filters.CorsFilter;
import gr.wind.FullStackSpring_Review.filters.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ApplicationSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private final ApplicationUserService applicationUserService;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private JwtRequestFilter jwtRequestFilter;
    @Autowired
    private CorsFilter corsFilter;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(applicationUserService);
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Autowired
    public ApplicationSecurityConfig(PasswordEncoder passwordEncoder,
                                     ApplicationUserService applicationUserService) {
        this.passwordEncoder = passwordEncoder;
        this.applicationUserService = applicationUserService;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable().authorizeRequests()

//                .authorizeRequests().antMatchers("/**").permitAll()
                .antMatchers("/api/authenticate", "/", "index", "login","/styles/**", "/css/*", "login.css",  "antd.css", "/js/*", "/api/authenticate").permitAll()
                .antMatchers("/actuator/**").permitAll()
                .antMatchers("/api/charts/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/users/**").hasRole(ApplicationUserRole.ADMIN.toString())
                .antMatchers(HttpMethod.POST, "/api/users/**").hasRole(ApplicationUserRole.ADMIN.toString())

                .antMatchers(HttpMethod.GET, "/api/incidents/getalladhocoutages",
                                                        "/api/incidents/nova_getallincidents",
                                                        "/api/incidents/getallincidents",
                                                        "/api/incidents/nova_getopenincidents",
                                                        "/api/incidents/getopenincidents",
                                                        "/api/incidents/getstatsfornovaincidentid/**",
                                                        "/api/incidents/nova_getalladhocoutages/**",
                                                        "/api/incidents/getstatsforwindincidentid/**",
                                                        "/api/incidents/nova_getallnonscheduledincidents",
                                                        "/api/incidents/getclosedcdrdbincidentsafterdate/",
                                                        "/api/incidents/getopennonscheduledincidents",
                                                        "/api/incidents/getallcdrdbincidents",
                                                        "/api/incidents/getclosedcdrdbincidents",
                                                        "/api/incidents/getopencdrdbincidents",
                                                        "/api/incidents/nova_getopennonscheduledincidents",
                                                        "/api/incidents/getallnonscheduledincidents").permitAll()

                .antMatchers(HttpMethod.PUT,"/api/incidents/willbepublishednoforincidentid/**",
                                            "/api/incidents/willbepublishedyesforincidentid/**",
                                            "/api/incidents/nova_willbepublishedyesforincidentid/**",
                                            "/api/incidents/nova_willbepublishednoforincidentid/**",
                                            "/api/incidents/nova_willbepublishedyesforoutageid/**",
                                            "/api/incidents/nova_willbepublishednoforoutageid/**",
                                            "/api/incidents/willbepublishedyesforoutageid/**",
                                            "/api/incidents/willbepublishednoforoutageid/**").hasAuthority(ApplicationUserPermission.USER_CAN_DISABLE_PUBLISHING.getPermission())

                .antMatchers(HttpMethod.PUT,"/api/incidents/changemessageforincidentid/**",
                                            "/api/incidents/nova_changemessageforincidentid/**",
                                            "/api/incidents/changemessageforoutageid/**",
                                            "/api/incidents/nova_changemessageforoutageid/**").hasAuthority(ApplicationUserPermission.USER_CAN_ALTER_MESSAGE.getPermission())

                .antMatchers(HttpMethod.PUT, "/api/incidents/nova_alterbackuppolicyforincidentid/**",
                                                        "/api/incidents/alterbackuppolicyforincidentid/**").hasAuthority(ApplicationUserPermission.USER_CAN_ALTER_BACKUP_POLICY.getPermission())

                .antMatchers(HttpMethod.GET, "/api/incidents/nova_downloadfile/**",
                                                        "/api/incidents/downloadcustomerscalledfornovaincidentid/**",
                                                        "/api/incidents/downloadcustomerscalledforwindincidentid/**",
                                                        "/api/incidents/downloadfile/**").hasAuthority(ApplicationUserPermission.USER_CAN_DOWNLOAD_FILES.getPermission())

                .antMatchers("/api/incidents/nova_deleteadhocincident/**",
                                        "/api/incidents/uploadadhocfile",
                                        "/api/incidents/previewadhocfile",
                                        "/api/incidents/nova_previewadhocfile",
                                        "/api/incidents/nova_uploadadhocfile",
                                        "/api/incidents/deleteadhocincident/**").hasAuthority(ApplicationUserPermission.USER_CAN_UPLOAD_ADHOC.getPermission())

                .anyRequest().authenticated().and().
                exceptionHandling().and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        //http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);


//        http
//                .csrf().disable()
//                .authorizeRequests()
//                /*.antMatchers("/", "index", "login","/styles/**", "/css/*", "login.css",  "antd.css", "/js/*").permitAll() */
//                .antMatchers("/**").permitAll()
//
//                .anyRequest()
//                .authenticated()
//                .and()
//                .formLogin()
////                .loginPage("/login")
//                .permitAll()
//                    .loginPage("/login")
//                    .loginProcessingUrl("/perform_login")
//                    .permitAll()
//                    .defaultSuccessUrl("/", true)
//                    .passwordParameter("password")
//                    .usernameParameter("username")
//                .and()
//                .logout()
//                    .logoutUrl("/logout")
//                    .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "GET")) // https://docs.spring.io/spring-security/site/docs/4.2.12.RELEASE/apidocs/org/springframework/security/config/annotation/web/configurers/LogoutConfigurer.html
//                    .clearAuthentication(true)
//                    .invalidateHttpSession(true)
//                    .deleteCookies("JSESSIONID")//, "remember-me")
//                    .logoutSuccessUrl("/login")
//                .and()
//                .sessionManagement()
//                .maximumSessions(1)
//                    .expiredUrl("/login")
//                    .maxSessionsPreventsLogin(true)
//                    .and()
//                    .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
//                    .invalidSessionUrl("/login");
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(applicationUserService);
        return provider;
    }

}
