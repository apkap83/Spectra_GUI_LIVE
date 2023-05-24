package gr.wind.FullStackSpring_Review.exception;

public class UserUpdateException extends RuntimeException {
    public UserUpdateException(String message) {
        super(message);
    }
}