package com.test.monorep_weather.service;

import com.test.monorep_weather.dto.WeatherResponse;
import com.test.monorep_weather.dto.WeatherHourlyForcastResponse;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.server.ResponseStatusException;

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

    public WeatherHourlyForcastResponse getHourlyTimeline(double lat, double lon, String units, String lang) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(
                "https://api.openweathermap.org/data/2.5/forecast")
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("appid", apiKey)
                .queryParam("units", units);

        if (lang != null && !lang.isBlank()) {
            builder.queryParam("lang", lang);
        }

        String url = builder.build().toUriString();
        try {
            return restTemplate.getForObject(url, WeatherHourlyForcastResponse.class);
        } catch (HttpClientErrorException.Unauthorized ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "OpenWeather forecast request was rejected by the upstream service.",
                    ex);
        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Unable to fetch forecast data from OpenWeather.",
                    ex);
        }
    }
}
