package com.test.monorep_weather;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class MonorepWeatherApplication {

	private static final Logger logger = LoggerFactory.getLogger(MonorepWeatherApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(MonorepWeatherApplication.class, args);
	}

	@Bean
	public CommandLineRunner debugConfig(Environment env) {
		return args -> {
			logger.info("========================================================================");
			logger.info("Application Configuration for Debugging:");
			logger.info("Application Name: {}", env.getProperty("spring.application.name"));
			logger.info("Server Port: {}", env.getProperty("server.port"));

			String apiKey = env.getProperty("OPEN_WEATHER_API_KEY");
			String maskedApiKey = "NOT_SET";
			if (apiKey != null && !apiKey.isEmpty()) {
				maskedApiKey = apiKey.substring(0, Math.min(apiKey.length(), 4)) + "****" +
						(apiKey.length() > 4 ? apiKey.substring(apiKey.length() - 4) : "");
				logger.info("OpenWeather API Key: {}", maskedApiKey);
			} else {
				logger.warn("OpenWeather API Key: NOT FOUND in environment variables!");
			}
			logger.info("========================================================================");

			// Also print to console directly
			System.out.println("\n--- DEBUG ENVIRONMENT CONFIG ---");
			System.out.println("App Name: " + env.getProperty("spring.application.name"));
			System.out.println("Port: " + env.getProperty("server.port"));
			System.out.println("API Key: " + maskedApiKey);
			System.out.println("--------------------------------\n");
		};
	}
}
