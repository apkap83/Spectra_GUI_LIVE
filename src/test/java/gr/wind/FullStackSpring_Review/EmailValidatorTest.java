package gr.wind.FullStackSpring_Review;

import gr.wind.FullStackSpring_Review.util.EmailValidator;
import org.junit.jupiter.api.Test;

import static java.lang.System.out;
import static org.assertj.core.api.Assertions.assertThat;

public class EmailValidatorTest {

    private static final EmailValidator underTest = new EmailValidator();

    @Test
    void itShouldValidateCorrectEmail() {
        out.println("Hello");
        assertThat(underTest.test("hello@wind.gr")).isTrue();
    }

    @Test
    void itShouldValidateInCorrectEmail2() {
        assertThat(underTest.test("hellowind.gr")).isFalse();
    }

    @Test
    void itShouldValidateInCorrectEmail3() {
        assertThat(underTest.test("ap.kapetanios123@gmail.com")).isTrue();
    }
}