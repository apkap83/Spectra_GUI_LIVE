package gr.wind.FullStackSpring_Review.security;

import gr.wind.FullStackSpring_Review.auth.ApplicationUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import static gr.wind.FullStackSpring_Review.security.ApplicationUserRole.*;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ApplicationSecurityConfig extends WebSecurityConfigurerAdapter {

    private final PasswordEncoder passwordEncoder;
    private final ApplicationUserService applicationUserService;

    @Autowired
    public ApplicationSecurityConfig(PasswordEncoder passwordEncoder,
                                     ApplicationUserService applicationUserService) {
        this.passwordEncoder = passwordEncoder;
        this.applicationUserService = applicationUserService;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()

                .authorizeRequests()
                /*.antMatchers("/", "index", "login","/styles/**", "/css/*", "login.css",  "antd.css", "/js/*").permitAll() */
        .antMatchers("/**").permitAll()

                .anyRequest()
                .authenticated()
                .and()
                .formLogin()
//                .loginPage("/login")
                .permitAll()
                    .loginPage("/login")
                    .loginProcessingUrl("/perform_login")
                    .permitAll()
                    .defaultSuccessUrl("/", true)
                    .passwordParameter("password")
                    .usernameParameter("username")
                .and()
//                .rememberMe()
//                    .tokenValiditySeconds((int) TimeUnit.DAYS.toSeconds(21))
//                    .key("somethingverysecuredZAQ!2wsx19999")
//                    .rememberMeParameter("remember-me")
//                .and()
                .logout()
                    .logoutUrl("/logout")
                    .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "GET")) // https://docs.spring.io/spring-security/site/docs/4.2.12.RELEASE/apidocs/org/springframework/security/config/annotation/web/configurers/LogoutConfigurer.html
                    .clearAuthentication(true)
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")//, "remember-me")
                    .logoutSuccessUrl("/login")
                .and()
                .sessionManagement()
                .maximumSessions(1)
                    .expiredUrl("/login")
                    .maxSessionsPreventsLogin(true)
                    .and()
                    .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                    .invalidSessionUrl("/login");
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
