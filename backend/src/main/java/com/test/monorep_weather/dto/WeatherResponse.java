package com.test.monorep_weather.dto;

import lombok.Data;
import java.util.List;

@Data
public class WeatherResponse {
    private Coord coord;
    private List<Weather> weather;
    private Main main;
    private String name;

    @Data
    public static class Coord {
        private double lon;
        private double lat;
    }

    @Data
    public static class Weather {
        private String main;
        private String description;
        private String icon;
    }

    @Data
    public static class Main {
        private double temp;
        private double pressure;
        private int humidity;
        private double temp_min;
        private double temp_max;
    }
}
