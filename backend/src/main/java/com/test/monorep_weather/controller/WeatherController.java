package com.test.monorep_weather.controller;

import com.test.monorep_weather.dto.WeatherResponse;
import com.test.monorep_weather.dto.WeatherHourlyForcastResponse;
import com.test.monorep_weather.service.WeatherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeatherController {

    private static final Logger logger = LoggerFactory.getLogger(WeatherController.class);
    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/")
    public String healthCheck() {
        logger.info("Health check endpoint called");
        return "Weather API Backend is Running";
    }

    @GetMapping("/api/get-weather")
    public WeatherResponse getWeather(@RequestParam String location) {
        logger.info("Weather request received for location: {}", location);
        return weatherService.getWeather(location);
    }

    @GetMapping("/api/get-hourly-timeline")
    public WeatherHourlyForcastResponse getHourlyTimeline(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(required = false, defaultValue = "metric") String units,
            @RequestParam(required = false) String lang) {
        logger.info("Hourly timeline request received for lat: {}, lon: {}", lat, lon);
        return weatherService.getHourlyTimeline(lat, lon, units, lang);
    }
}
