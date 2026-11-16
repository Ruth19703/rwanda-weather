#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

import { showWeather, showForecast } from "./weather.js";
import { getCurrentWeather } from "./weatherApi.js";
import { addCity, listCities, removeCity } from "./cities.js";

const program = new Command();

program
  .name("rwanda-weather")
  .description("A command-line weather application for Rwanda")
  .version("1.0.0");

// Current weather
program
  .command("weather <city...>")
  .description("Display current weather for a city")
  .action(async (city) => {
    await showWeather(city.join(" "));
  });

// Seven-day forecast
program
  .command("forecast <city...>")
  .description("Display a seven-day weather forecast")
  .action(async (city) => {
    await showForecast(city.join(" "));
  });

// Humidity only
program
  .command("humidity <city...>")
  .description("Display humidity for a city")
  .action(async (city) => {
    const cityName = city.join(" ");
    const spinner = ora(`Checking humidity in ${cityName}...`).start();

    try {
      const weather = await getCurrentWeather(cityName);

      spinner.succeed("Humidity information received!");

      console.log(
        chalk.blue.bold(`\nHumidity in ${weather.city}, ${weather.country}`)
      );
      console.log(chalk.cyan(`Humidity: ${weather.humidity}%`));
    } catch (error) {
      spinner.fail(chalk.red(error.message));
      process.exitCode = 1;
    }
  });

// Favourite city commands
const cityCommand = program
  .command("city")
  .description("Manage your favourite cities");

cityCommand
  .command("add <city...>")
  .description("Add a favourite city")
  .action((city) => {
    addCity(city.join(" "));
  });

cityCommand
  .command("list")
  .description("List your favourite cities")
  .action(() => {
    listCities();
  });

cityCommand
  .command("remove <city...>")
  .description("Remove a favourite city")
  .action((city) => {
    removeCity(city.join(" "));
  });

program.addHelpText(
  "after",
  `
Examples:
  $ rwanda-weather weather Kigali
  $ rwanda-weather forecast Huye
  $ rwanda-weather humidity Musanze
  $ rwanda-weather city add Rubavu
  $ rwanda-weather city list
  $ rwanda-weather city remove Rubavu
`
);

program.parseAsync(process.argv).catch((error) => {
  console.error(chalk.red(error.message));
  process.exitCode = 1;
});
