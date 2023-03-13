# IDE-VulScanner

Most of the vulnerability scanner tools caters to code which is built and ready for deployment. Most commonly tools used are Snyk, SonarQube and others.&#x20;

IDE-VulScanner is a IDE agnostic tool for developers to identify vulnerable code dependencies during implementation phase, which in-tern would save huge security patching cost identified via CI/CD pipelines otherwise.

### Features

* Vulnerability code scan during implementation phase
* Save security patch & maintenance cost
* Low overall high & critical vulnerabilities
* Works for all the know IDEs i.e. Intellij, eclipse, VS Code etc.

### Recommendations

* [https://owasp.org/www-project-dependency-track/](https://owasp.org/www-project-dependency-track/)

### An IDE plugin view

IDE plugin failing code due to CVE score of any one dependencies going beyond 9.

```sh
[ERROR] One or more dependencies were identified with vulnerabilities that have a CVSS score greater than or equal to '9.0':
[ERROR]
[ERROR] c3p0-0.9.5.2.jar: CVE-2018-20433(9.8)
[ERROR] commons-jxpath-1.3.jar: CVE-2022-41852(9.8)
[ERROR] dom4j-1.6.1.jar: CVE-2020-10683(9.8)
[ERROR] flatpack-3.1.1.jar: CVE-2020-36632(9.8)
[ERROR] groovy-all-2.4.4-indy.jar: CVE-2016-6814(9.8)
[ERROR] jackson-databind-2.8.9.jar: CVE-2017-17485(9.8), CVE-2020-9547(9.8), CVE-2020-9548(9.8), CVE-2019-14379(9.8), CVE-2019-20330(9.8), CVE-2018-11307(9.8), CVE-2018-14718(9.8), CVE-2018-7489(9.8), CVE-2018-14719(9.8), CVE-2019-17531(9.8), CVE-2019-14540(9.8), CVE-2020-9546(9.8), CVE-2017-15095(9.8), CVE-2019-16942(9.8), CVE-2019-16943(9.8), CVE-2018-19362(9.8), CVE-2018-19361(9.8), CVE-2018-19360(9.8), CVE-2019-17267(9.8), CVE-2019-16335(9.8), CVE-2018-14721(10.0), CVE-2018-14720(9.8), CVE-2019-14893(9.8), CVE-2020-8840(9.8), CVE-2019-14892(9.8)
[ERROR] log4j-1.2.17.jar: CVE-2020-9493(9.8), CVE-2022-23307(8.8), CVE-2022-23305(9.8), CVE-2019-17571(9.8)
[ERROR] log4j-core-2.8.2.jar: CVE-2021-44228(10.0), CVE-2021-45046(9.0)
[ERROR] mule-extensions-api-1.0.0-alpha-1.jar: CVE-2019-13116(9.8)
[ERROR] quartz-2.2.1.jar: CVE-2019-13990(9.8)
[ERROR] snakeyaml-1.15.jar: CVE-2022-1471(9.8)
[ERROR] spring-core-4.1.9.RELEASE.jar: CVE-2022-22965(9.8), CVE-2018-1270(9.8)
[ERROR] spring-messaging-4.1.9.RELEASE.jar: CVE-2022-22965(9.8), CVE-2018-1270(9.8)
[ERROR] spring-web-4.1.9.RELEASE.jar: CVE-2022-22965(9.8), CVE-2016-1000027(9.8), CVE-2018-1270(9.8)
[ERROR] xmlbeans-2.6.0.jar: CVE-2021-23926(9.1)
[ERROR] xstream-1.4.10.jar: CVE-2020-26217(8.8), CVE-2021-21351(9.1), CVE-2021-21350(9.8), CVE-2013-7285(9.8), CVE-2021-21347(9.8), CVE-2021-21346(9.8), CVE-2021-21345(9.9), CVE-2021-21344(9.8), CVE-2021-21342(9.1), CVE-2019-10173(9.8)
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoFailureException

```


