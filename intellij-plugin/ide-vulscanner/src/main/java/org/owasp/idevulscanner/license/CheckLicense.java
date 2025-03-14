package org.owasp.idevulscanner.license;

import com.intellij.openapi.actionSystem.*;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.application.ModalityState;
import com.intellij.ui.LicensingFacade;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.security.Signature;
import java.security.cert.*;
import java.util.*;

public class CheckLicense {
    /**
     * PRODUCT_CODE must be the same specified in plugin.xml inside the <product-descriptor> tag
     */
    private static final String PRODUCT_CODE = "";
    private static final String KEY_PREFIX = "key:";
    private static final String STAMP_PREFIX = "stamp:";
    private static final String EVAL_PREFIX = "eval:";

    /**
     * Public root certificates needed to verify JetBrains-signed licenses
     */
    private static final String[] ROOT_CERTIFICATES = new String[] {
            "-----BEGIN CERTIFICATE-----\n" +
                    "MIIFOzCCAyOgAwIBAgIJANJssYOyg3nhMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNV\n" +
                    "BAMMDUpldFByb2ZpbGUgQ0EwHhcNMTUxMDAyMTEwMDU2WhcNNDUxMDI0MTEwMDU2\n" +
                    "WjAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMIICIjANBgkqhkiG9w0BAQEFAAOC\n" +
                    "Ag8AMIICCgKCAgEA0tQuEA8784NabB1+T2XBhpB+2P1qjewHiSajAV8dfIeWJOYG\n" +
                    "y+ShXiuedj8rL8VCdU+yH7Ux/6IvTcT3nwM/E/3rjJIgLnbZNerFm15Eez+XpWBl\n" +
                    "m5fDBJhEGhPc89Y31GpTzW0vCLmhJ44XwvYPntWxYISUrqeR3zoUQrCEp1C6mXNX\n" +
                    "EpqIGIVbJ6JVa/YI+pwbfuP51o0ZtF2rzvgfPzKtkpYQ7m7KgA8g8ktRXyNrz8bo\n" +
                    "iwg7RRPeqs4uL/RK8d2KLpgLqcAB9WDpcEQzPWegbDrFO1F3z4UVNH6hrMfOLGVA\n" +
                    "xoiQhNFhZj6RumBXlPS0rmCOCkUkWrDr3l6Z3spUVgoeea+QdX682j6t7JnakaOw\n" +
                    "jzwY777SrZoi9mFFpLVhfb4haq4IWyKSHR3/0BlWXgcgI6w6LXm+V+ZgLVDON52F\n" +
                    "LcxnfftaBJz2yclEwBohq38rYEpb+28+JBvHJYqcZRaldHYLjjmb8XXvf2MyFeXr\n" +
                    "SopYkdzCvzmiEJAewrEbPUaTllogUQmnv7Rv9sZ9jfdJ/cEn8e7GSGjHIbnjV2ZM\n" +
                    "Q9vTpWjvsT/cqatbxzdBo/iEg5i9yohOC9aBfpIHPXFw+fEj7VLvktxZY6qThYXR\n" +
                    "Rus1WErPgxDzVpNp+4gXovAYOxsZak5oTV74ynv1aQ93HSndGkKUE/qA/JECAwEA\n" +
                    "AaOBhzCBhDAdBgNVHQ4EFgQUo562SGdCEjZBvW3gubSgUouX8bMwSAYDVR0jBEEw\n" +
                    "P4AUo562SGdCEjZBvW3gubSgUouX8bOhHKQaMBgxFjAUBgNVBAMMDUpldFByb2Zp\n" +
                    "bGUgQ0GCCQDSbLGDsoN54TAMBgNVHRMEBTADAQH/MAsGA1UdDwQEAwIBBjANBgkq\n" +
                    "hkiG9w0BAQsFAAOCAgEAjrPAZ4xC7sNiSSqh69s3KJD3Ti4etaxcrSnD7r9rJYpK\n" +
                    "BMviCKZRKFbLv+iaF5JK5QWuWdlgA37ol7mLeoF7aIA9b60Ag2OpgRICRG79QY7o\n" +
                    "uLviF/yRMqm6yno7NYkGLd61e5Huu+BfT459MWG9RVkG/DY0sGfkyTHJS5xrjBV6\n" +
                    "hjLG0lf3orwqOlqSNRmhvn9sMzwAP3ILLM5VJC5jNF1zAk0jrqKz64vuA8PLJZlL\n" +
                    "S9TZJIYwdesCGfnN2AETvzf3qxLcGTF038zKOHUMnjZuFW1ba/12fDK5GJ4i5y+n\n" +
                    "fDWVZVUDYOPUixEZ1cwzmf9Tx3hR8tRjMWQmHixcNC8XEkVfztID5XeHtDeQ+uPk\n" +
                    "X+jTDXbRb+77BP6n41briXhm57AwUI3TqqJFvoiFyx5JvVWG3ZqlVaeU/U9e0gxn\n" +
                    "8qyR+ZA3BGbtUSDDs8LDnE67URzK+L+q0F2BC758lSPNB2qsJeQ63bYyzf0du3wB\n" +
                    "/gb2+xJijAvscU3KgNpkxfGklvJD/oDUIqZQAnNcHe7QEf8iG2WqaMJIyXZlW3me\n" +
                    "0rn+cgvxHPt6N4EBh5GgNZR4l0eaFEV+fxVsydOQYo1RIyFMXtafFBqQl6DDxujl\n" +
                    "FeU3FZ+Bcp12t7dlM4E0/sS1XdL47CfGVj4Bp+/VbF862HmkAbd7shs7sDQkHbU=\n" +
                    "-----END CERTIFICATE-----\n",
            "-----BEGIN CERTIFICATE-----\n" +
                    "MIIFTDCCAzSgAwIBAgIJAMCrW9HV+hjZMA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNV\n" +
                    "BAMMEkxpY2Vuc2UgU2VydmVycyBDQTAgFw0xNjEwMTIxNDMwNTRaGA8yMTE2MTIy\n" +
                    "NzE0MzA1NFowHTEbMBkGA1UEAwwSTGljZW5zZSBTZXJ2ZXJzIENBMIICIjANBgkq\n" +
                    "hkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAoT7LvHj3JKK2pgc5f02z+xEiJDcvlBi6\n" +
                    "fIwrg/504UaMx3xWXAE5CEPelFty+QPRJnTNnSxqKQQmg2s/5tMJpL9lzGwXaV7a\n" +
                    "rrcsEDbzV4el5mIXUnk77Bm/QVv48s63iQqUjVmvjQt9SWG2J7+h6X3ICRvF1sQB\n" +
                    "yeat/cO7tkpz1aXXbvbAws7/3dXLTgAZTAmBXWNEZHVUTcwSg2IziYxL8HRFOH0+\n" +
                    "GMBhHqa0ySmF1UTnTV4atIXrvjpABsoUvGxw+qOO2qnwe6ENEFWFz1a7pryVOHXg\n" +
                    "P+4JyPkI1hdAhAqT2kOKbTHvlXDMUaxAPlriOVw+vaIjIVlNHpBGhqTj1aqfJpLj\n" +
                    "qfDFcuqQSI4O1W5tVPRNFrjr74nDwLDZnOF+oSy4E1/WhL85FfP3IeQAIhCVsZGq\n" +
                    "T0lhtzct6LIRv07jmDkZ2Jz/3c5vZ4wQp1iWoAD2V6fZkVQAiFv6oxCH44Qs9TxD\n" +
                    "2auBzjrhDPFi4DpmQdmzY6bmFcRd5qdqObcmfSxNmP5k30uFgO8ml8DdHlbkVFFs\n" +
                    "Fg3gH2BbQgR7zdiFiwMybE2F0/jZpwDAZgs71mh/sj1rpt84xyOgt1z6VeyrrFsO\n" +
                    "NTkZcbu2xpcV4Zua2F2H9bb66hrqZYuOtGGTsJ8dx5vMyVpQDE6IuXpyhMRE9bUw\n" +
                    "hKrsFVhErlbZa6+ZbmwlgjU7qWkbfcgJYkUz6au1TvmjLDizysGViiwdSTYcvzUB\n" +
                    "B7BpBqVgKvE=\n" +
                    "-----END CERTIFICATE-----\n"
    };

    private static final Set<String> LICENSE_TYPES = new HashSet<>(Arrays.asList(KEY_PREFIX, STAMP_PREFIX, EVAL_PREFIX));
    private static final Map<String, Integer> licenseTypeMap = new HashMap<>();

    public static void main(String[] args) {
        String licenseKey = "key:LICENSE_KEY";
        checkLicense(licenseKey);
    }

    public static void checkLicense(String licenseKey) {
        if (licenseKey == null || licenseKey.isEmpty()) {
            System.out.println("No license key provided.");
            return;
        }

        String prefix = getPrefix(licenseKey);
        if (prefix == null) {
            System.out.println("Invalid license key prefix.");
            return;
        }

        if (LICENSE_TYPES.contains(prefix)) {
            // Perform appropriate action based on license type.
            System.out.println("Valid license prefix: " + prefix);
            validateLicense(licenseKey, prefix);
        } else {
            System.out.println("Unsupported license type.");
        }
    }

    private static String getPrefix(String licenseKey) {
        for (String prefix : LICENSE_TYPES) {
            if (licenseKey.startsWith(prefix)) {
                return prefix;
            }
        }
        return null;
    }

    private static void validateLicense(String licenseKey, String prefix) {
        // Validate the license based on its type.
        if (prefix.equals(KEY_PREFIX)) {
            System.out.println("Validating Key-Based License.");
            validateKeyBasedLicense(licenseKey);
        } else if (prefix.equals(STAMP_PREFIX)) {
            System.out.println("Validating License Server-Based License.");
            validateServerLicense(licenseKey);
        } else if (prefix.equals(EVAL_PREFIX)) {
            System.out.println("Validating Evaluation License.");
            validateEvaluationLicense(licenseKey);
        }
    }

    private static void validateKeyBasedLicense(String licenseKey) {
        // Simulate Key-Based License Validation Logic
        System.out.println("License Key: " + licenseKey);
    }

    private static void validateServerLicense(String licenseKey) {
        // Simulate License Server Validation Logic
        System.out.println("License Stamp: " + licenseKey);
    }

    private static void validateEvaluationLicense(String licenseKey) {
        // Simulate Evaluation License Validation Logic
        System.out.println("Evaluation License: " + licenseKey);
    }
}
