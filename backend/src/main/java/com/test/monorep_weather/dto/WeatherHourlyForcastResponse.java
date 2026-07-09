package com.test.monorep_weather.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherHourlyForcastResponse {

	private String cod;
	private double message;
	private int cnt;
	private List<ForecastItem> list;
	private City city;

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class ForecastItem {
		private long dt;
		private Main main;
		private List<Weather> weather;
		private Clouds clouds;
		private Wind wind;
		private int visibility;
		private double pop;
		private Rain rain;
		private Snow snow;
		private Sys sys;
		private String dt_txt;

		@Data
		@JsonIgnoreProperties(ignoreUnknown = true)
		public static class Main {
			private double temp;
			private double feels_like;
			private double temp_min;
			private double temp_max;
			private int pressure;
			private int sea_level;
			private int grnd_level;
			private int humidity;
			private double temp_kf;
		}

		@Data
		@JsonIgnoreProperties(ignoreUnknown = true)
		public static class Weather {
			private int id;
			private String main;
			private String description;
			private String icon;
		}

		@Data
		@JsonIgnoreProperties(ignoreUnknown = true)
		public static class Clouds {
			private int all;
		}

		@Data
		@JsonIgnoreProperties(ignoreUnknown = true)
		public static class Wind {
			private double speed;
			private int deg;
			private Double gust;
		}

		@Data
		@JsonIgnoreProperties(ignoreUnknown = true)
		public static class Rain {
			@JsonProperty("3h")
			private Double threeHour;
		}

		@Data
		@JsonIgnoreProperties(ignoreUnknown = true)
		public static class Snow {
			@JsonProperty("3h")
			private Double threeHour;
		}

		@Data
		@JsonIgnoreProperties(ignoreUnknown = true)
		public static class Sys {
			private String pod;
		}
	}

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class City {
		private int id;
		private String name;
		private Coord coord;
		private String country;
		private int population;
		private int timezone;
		private long sunrise;
		private long sunset;

		@Data
		@JsonIgnoreProperties(ignoreUnknown = true)
		public static class Coord {
			private double lat;
			private double lon;
		}
	}
}
