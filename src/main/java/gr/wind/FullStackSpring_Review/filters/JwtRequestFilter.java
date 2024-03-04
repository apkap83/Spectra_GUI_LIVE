package gr.wind.FullStackSpring_Review.filters;


import gr.wind.FullStackSpring_Review.auth.ApplicationUserService;
import gr.wind.FullStackSpring_Review.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private ApplicationUserService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");

        final String requestUri = request.getRequestURI();
        final String query = request.getQueryString();
        final String authorizationHeader = request.getHeader("Authorization");

        // Pattern to extract date parameters from the query string
        Pattern datePattern = Pattern.compile("from=(\\d{4}-\\d{2}-\\d{2})&to=(\\d{4}-\\d{2}-\\d{2})");
        Matcher matcher = datePattern.matcher(query != null ? query : "");

        // Disable JWT Authorization for iFrame of Ioannis Lakkas
        if (requestUri.equals("/api/charts/proxy/dslam-outage") && matcher.find()) {
            // Extracted dates
            String fromDate = matcher.group(1);
            String toDate = matcher.group(2);

            // Logic to determine if the request should be allowed
            // Example: Allow all dates or implement specific logic

            chain.doFilter(request, response);
            return;
        }

        // If no JWT Token provided and not using the authorization URI, then return HTTP 401 (unauthorized)
        if (authorizationHeader == null && !request.getRequestURI().equals("/api/authenticate")) {

            // Only /api requests, need a JWT
            if (request.getRequestURI().startsWith("/api")) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                String errorMessage = "No JWT token provided. Please include a valid token in the Authorization header.";
                response.getWriter().write("{\"error\": \"" + errorMessage + "\"}");
                return;
            }
        }

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer: ")) {
            jwt = authorizationHeader.substring(7);

            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

//        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//
//            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
//
//            if (jwtUtil.validateToken(jwt, userDetails)) {
//
//                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
//                        userDetails, null, userDetails.getAuthorities());
//                usernamePasswordAuthenticationToken
//                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
//            }
//        }
        chain.doFilter(request, response);
    }

}
