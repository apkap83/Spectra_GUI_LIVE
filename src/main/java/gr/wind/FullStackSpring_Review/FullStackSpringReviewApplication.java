package gr.wind.FullStackSpring_Review;

import gr.wind.FullStackSpring_Review.uploadingfiles.StorageProperties;
import gr.wind.FullStackSpring_Review.uploadingfiles.StorageService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Controller
@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class FullStackSpringReviewApplication implements ErrorController {

	private static final Logger logger = LogManager.getLogger(FullStackSpringReviewApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(FullStackSpringReviewApplication.class, args);
	}
		@Bean
		CommandLineRunner init(StorageService storageService) {
			return (args) -> {
				storageService.deleteAll();
				storageService.init();
			};
		}

	private static final String PATH = "/error";

	@RequestMapping(value = PATH)
	public String error() {
		return "forward:/index.html";
	}

	@Override
	public String getErrorPath() {
		return PATH;
	}
}
