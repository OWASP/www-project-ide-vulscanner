import org.jetbrains.changelog.markdownToHTML
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

fun properties(key: String) = project.findProperty(key)?.toString() ?: error("Missing property: $key")

plugins {
    id("java") // Java support
    id("org.jetbrains.kotlin.jvm") version "1.9.22" // Updated Kotlin
    id("org.jetbrains.intellij") version "1.15.0" // Updated IntelliJ Plugin
    id("org.jetbrains.changelog") version "2.1.0" // Updated Changelog Plugin
    id("org.jetbrains.qodana") version "0.1.14" // Updated Qodana Plugin
    id("org.jetbrains.kotlinx.kover") version "0.7.0" // Updated Kover Plugin
}

group = properties("pluginGroup")
version = properties("pluginVersion")

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(17)
}

// IntelliJ Plugin Configuration
intellij {
    pluginName.set(properties("pluginName"))
    version.set(properties("platformVersion"))
    type.set(properties("platformType"))
    plugins.set(properties("platformPlugins").split(',').map(String::trim).filter(String::isNotEmpty))
    downloadSources.set(true)
}

// Dependencies
dependencies {
    implementation("org.json:json:20231013") // Updated JSON Library
    implementation("org.apache.maven:maven-model:3.9.6") {
        exclude(group = "org.apache.logging.log4j", module = "log4j-to-slf4j")
    }
    implementation("org.owasp:dependency-check-cli:8.4.0") // Updated OWASP Dependency Checker
    implementation("org.apache.maven.shared:maven-invoker:3.3.0")

    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2") // Updated JUnit
    testImplementation("org.mockito:mockito-core:5.7.0") // Updated Mockito
    testImplementation("org.mockito:mockito-junit-jupiter:5.7.0")
}

// Changelog Plugin Configuration
changelog {
    version.set(properties("pluginVersion"))
    groups.set(emptyList())
}

// Qodana Plugin Configuration
qodana {
    cachePath.set(projectDir.resolve(".qodana").canonicalPath)
    reportPath.set(projectDir.resolve("build/reports/inspections").canonicalPath)
    saveReport.set(true)
    showReport.set(System.getenv("QODANA_SHOW_REPORT")?.toBoolean() ?: false)
}

// Kover Plugin Configuration
kover.xmlReport {
    onCheck.set(true)
}

tasks {
    // Set JVM compatibility
    properties("javaVersion").let {
        withType<JavaCompile> {
            sourceCompatibility = it
            targetCompatibility = it
        }
        withType<KotlinCompile> {
            kotlinOptions.jvmTarget = it
        }
    }

    wrapper {
        gradleVersion = properties("gradleVersion")
    }

    runIdeForUiTests {
        systemProperty("robot-server.port", "8082")
        systemProperty("ide.mac.message.dialogs.as.sheets", "false")
        systemProperty("jb.privacy.policy.text", "<!--999.999-->")
        systemProperty("jb.consents.confirmation.enabled", "false")
    }

    signPlugin {
        certificateChain.set(System.getenv("CERTIFICATE_CHAIN"))
        privateKey.set(System.getenv("PRIVATE_KEY"))
        password.set(System.getenv("PRIVATE_KEY_PASSWORD"))
    }

    publishPlugin {
        dependsOn("patchChangelog")
        token.set(System.getenv("PUBLISH_TOKEN"))
        channels.set(listOf(properties("pluginVersion").split('-').getOrElse(1) { "default" }.split('.').first()))
    }
}
