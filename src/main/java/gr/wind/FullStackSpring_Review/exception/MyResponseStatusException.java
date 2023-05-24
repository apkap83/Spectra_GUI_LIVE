package gr.wind.FullStackSpring_Review.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class MyResponseStatusException extends ResponseStatusException {

    public MyResponseStatusException(HttpStatus status) {
        super(status);
    }

    public MyResponseStatusException(HttpStatus status, String reason) {
        super(status, reason);
    }

    public MyResponseStatusException(HttpStatus status, String reason, Throwable cause) {
        super(status, reason, cause);
    }

    public MyResponseStatusException(int rawStatusCode, String reason, Throwable cause) {
        super(rawStatusCode, reason, cause);
    }

    @Override
    public synchronized Throwable fillInStackTrace() {
        // Exclude stack trace from the response
        return this;
    }
}
