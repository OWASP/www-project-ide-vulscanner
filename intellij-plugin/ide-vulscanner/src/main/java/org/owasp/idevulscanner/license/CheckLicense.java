import java.io.*;
import java.net.*;
import java.security.cert.*;
import java.text.*;
import java.util.*;

public class LicenseValidator {

    // License Prefixes
    private static final String KEY_PREFIX = "key:";
    private static final String STAMP_PREFIX = "stamp:";
    private static final String EVAL_PREFIX = "eval:";

    // Root certificates (replace these with your actual root certificates)
    private static final String[] ROOT_CERTIFICATES = {
        "MIIDdzCCAl+gAwIBAgIEUqALgAA==", // Example root certificate (Base64 encoded)
        // Add more certificates here
    };

    public static void main(String[] args) {
        String licenseKey = "key:abc123456789"; // Example license key (replace it with actual license)
        String prefix = licenseKey.substring(0, 4);

        validateLicense(licenseKey, prefix);
    }

    private static void validateLicense(String licenseKey, String prefix) {
        // Check if the license key has expired
        if (!checkLicenseExpiration(licenseKey)) {
            System.out.println("License has expired.");
            return;
        }

        // Validate the license type and format
        switch (prefix) {
            case KEY_PREFIX:
                System.out.println("Validating Key-Based License.");
                validateKeyBasedLicense(licenseKey);
                break;
            case STAMP_PREFIX:
                System.out.println("Validating License Server-Based License.");
                validateServerLicense(licenseKey);
                break;
            case EVAL_PREFIX:
                System.out.println("Validating Evaluation License.");
                validateEvaluationLicense(licenseKey);
                break;
            default:
                System.out.println("Unsupported license type.");
        }

        // Perform certificate validation (if needed)
        if (validateCertificate(licenseKey)) {
            System.out.println("License certificate is valid.");
        } else {
            System.out.println("License certificate validation failed.");
        }

        // Optionally validate the license against a remote server
        if (validateLicenseOnServer(licenseKey)) {
            System.out.println("Remote server license validation successful.");
        } else {
            System.out.println("Remote server license validation failed.");
        }
    }

    private static boolean checkLicenseExpiration(String licenseKey) {
        // Extract the expiration date from the license key (for example, encoded in the license itself)
        try {
            String expirationDateString = licenseKey.substring(licenseKey.indexOf("expiry:") + 7);
            Date expirationDate = new SimpleDateFormat("yyyy-MM-dd").parse(expirationDateString);
            Date currentDate = new Date();

            if (currentDate.after(expirationDate)) {
                return false; // Expired license
            }

            return true; // Valid license
        } catch (Exception e) {
            System.out.println("Error checking license expiration: " + e.getMessage());
            return false;
        }
    }

    private static boolean validateKeyBasedLicense(String licenseKey) {
        // Perform key-based validation logic (you can add custom checks here)
        System.out.println("Key-Based License validated successfully.");
        return true;
    }

    private static boolean validateServerLicense(String licenseKey) {
        // Perform server-based license validation logic (you can add custom checks here)
        System.out.println("Server-Based License validated successfully.");
        return true;
    }

    private static boolean validateEvaluationLicense(String licenseKey) {
        // Perform evaluation license validation logic (you can add custom checks here)
        System.out.println("Evaluation License validated successfully.");
        return true;
    }

    private static boolean validateCertificate(String certificate) {
        try {
            // Load the certificate from the provided string
            CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
            ByteArrayInputStream certStream = new ByteArrayInputStream(certificate.getBytes(StandardCharsets.UTF_8));
            X509Certificate cert = (X509Certificate) certFactory.generateCertificate(certStream);

            // Create a CertificateFactory for the root certificates
            List<X509Certificate> trustedCerts = new ArrayList<>();
            for (String rootCert : ROOT_CERTIFICATES) {
                CertificateFactory rootCertFactory = CertificateFactory.getInstance("X.509");
                ByteArrayInputStream rootCertStream = new ByteArrayInputStream(rootCert.getBytes(StandardCharsets.UTF_8));
                X509Certificate rootCertificate = (X509Certificate) rootCertFactory.generateCertificate(rootCertStream);
                trustedCerts.add(rootCertificate);
            }

            // Verify the certificate chain
            TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            trustManagerFactory.init((KeyStore) null);
            X509TrustManager x509TrustManager = (X509TrustManager) trustManagerFactory.getTrustManagers()[0];

            // Validate the certificate chain against the root certificates
            for (X509Certificate trustedCert : trustedCerts) {
                try {
                    cert.verify(trustedCert.getPublicKey());
                    System.out.println("Certificate verified successfully against root certificate.");
                    return true;
                } catch (Exception e) {
                    System.out.println("Certificate validation failed against root certificate: " + e.getMessage());
                }
            }

            System.out.println("Certificate verification failed.");
            return false;
        } catch (Exception e) {
            System.out.println("Error validating certificate: " + e.getMessage());
            return false;
        }
    }

    private static boolean validateLicenseOnServer(String licenseKey) {
        try {
            // Prepare the request URL and connection
            String serverUrl = "https://your-license-server.com/validate?license=" + licenseKey;
            URL url = new URL(serverUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            // Read the server response
            int responseCode = connection.getResponseCode();
            if (responseCode == 200) {
                // Successful response, license is valid
                System.out.println("License validated successfully on server.");
                return true;
            } else {
                // Failed response, license is invalid
                System.out.println("License validation failed on server.");
                return false;
            }
        } catch (Exception e) {
            System.out.println("Error validating license on server: " + e.getMessage());
            return false;
        }
    }
}
