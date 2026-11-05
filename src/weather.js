import chalk from "chalk";
import ora from "ora";

import {
  getCurrentWeather,
  getForecast
} from "../services/weatherApi.js";

// Display current weather
export async function showWeather(city) {
  if (!city) {
    console.log(chalk.red("Please provide a city name."));
    return;
  }

  const spinner = ora(`Getting weather for ${city}...`).start();

  try {
    const weather = await getCurrentWeather(city);

    spinner.succeed("Weather information received!");

    console.log(chalk.blue.bold(`\nWeather in ${weather.city}, ${weather.country}`));
    console.log(chalk.yellow(`Temperature: ${weather.temperature}°C`));
    console.log(`Feels like: ${weather.feelsLike}°C`);
    console.log(`Humidity: ${weather.humidity}%`);
    console.log(`Wind speed: ${weather.windSpeed} km/h`);
    console.log(`Precipitation: ${weather.precipitation} mm`);
    console.log(`Last updated: ${weather.time}`);

  } catch (error) {
    spinner.fail(chalk.red(error.message));
  }
}

// Display 7-day forecast
export async function showForecast(city) {
  if (!city) {
    console.log(chalk.red("Please provide a city name."));
    return;
  }

  const spinner = ora(`Getting forecast for ${city}...`).start();

  try {
    const result = await getForecast(city);

    spinner.succeed("Forecast received!");

    console.log(chalk.blue.bold(`\n7-Day Forecast for ${result.city}, ${result.country}`));

    result.forecast.time.forEach((date, index) => {
      console.log(chalk.green(`\n${date}`));
      console.log(`Maximum: ${result.forecast.temperature_2m_max[index]}°C`);
      console.log(`Minimum: ${result.forecast.temperature_2m_min[index]}°C`);
      console.log(
        `Rain probability: ${result.forecast.precipitation_probability_max[index]}%`
      );
    });

  } catch (error) {
    spinner.fail(chalk.red(error.message));
  }
}