package com.test.monorep_weather.service;

import com.test.monorep_weather.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class WeatherService {

    @Value("${app.openweather.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public WeatherService() {
        this.restTemplate = new RestTemplate();
    }

    public WeatherResponse getWeather(String location) {
        String url = UriComponentsBuilder.fromUriString("https://api.openweathermap.org/data/2.5/weather")
                .queryParam("q", location)
                .queryParam("appid", apiKey)
                .queryParam("units", "metric")
                .build().toUriString();

        return restTemplate.getForObject(url, WeatherResponse.class);
    }
}
