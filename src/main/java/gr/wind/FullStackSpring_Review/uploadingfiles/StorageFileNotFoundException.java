package gr.wind.FullStackSpring_Review.uploadingfiles;

public class StorageFileNotFoundException extends gr.wind.FullStackSpring_Review.uploadingfiles.StorageException {

	public StorageFileNotFoundException(String message) {
		super(message);
	}

	public StorageFileNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}
}
