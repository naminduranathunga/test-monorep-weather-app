package com.test.monorep_weather.controller;

import com.test.monorep_weather.dto.WeatherResponse;
import com.test.monorep_weather.service.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/")
    public String healthCheck() {
        return "Weather API Backend is Running";
    }

    @GetMapping("/api/get-weather")
    public WeatherResponse getWeather(@RequestParam String location) {
        return weatherService.getWeather(location);
    }
}
