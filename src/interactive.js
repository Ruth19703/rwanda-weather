
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import chalk from "chalk";
import ora from "ora";

import { showWeather, showForecast } from "./weather.js";
import { getCurrentWeather } from "./weatherApi.js";
import { addCity, listCities, removeCity } from "./cities.js";

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

let running = true;

// Ask the user a question
async function ask(question) {
  const answer = await rl.question(question);
  return answer.trim();
}

// Display the main menu
function showMenu() {
  console.log(chalk.blue.bold("\n================================"));
  console.log(chalk.blue.bold("       RWANDA WEATHER CLI"));
  console.log(chalk.blue.bold("================================"));
  console.log("1. Check current weather");
  console.log("2. Check humidity");
  console.log("3. View 7-day forecast");
  console.log("4. Add favourite city");
  console.log("5. View favourite cities");
  console.log("6. Remove favourite city");
  console.log("7. Exit");
  console.log(chalk.blue("--------------------------------"));
}

// Wait for Enter to return to the main menu
async function waitForMenuShortcut() {
  await ask(
    chalk.yellow("\nPress Enter to return to the main menu...")
  );
}

// Check humidity
async function checkHumidity(city) {
  const spinner = ora(`Checking humidity in ${city}...`).start();

  try {
    const weather = await getCurrentWeather(city);

    spinner.succeed("Humidity information received!");

    console.log(
      chalk.blue.bold(`\nHumidity in ${weather.city}, ${weather.country}`)
    );

    console.log(chalk.cyan(`Humidity: ${weather.humidity}%`));
  } catch (error) {
    spinner.fail(chalk.red(error.message));
  }
}

// Ask for a city and display the requested weather information
async function searchWeather(type) {
  const city = await ask(chalk.yellow("Enter city name: "));

  if (!city) {
    console.log(chalk.red("Please enter a city name."));
    return;
  }

  switch (type) {
    case "weather":
      await showWeather(city);
      break;

    case "humidity":
      await checkHumidity(city);
      break;

    case "forecast":
      await showForecast(city);
      break;

    default:
      console.log(chalk.red("Invalid weather option."));
      return;
  }

  // Wait for Enter after displaying the results
  await waitForMenuShortcut();
}

// Main application
async function runMenu() {
  console.log(chalk.green.bold("\nWelcome to Rwanda Weather!"));

  while (running) {
    showMenu();

    const choice = await ask(
      chalk.yellow("Choose an option (1-7): ")
    );

    try {
      switch (choice) {
        case "1":
          await searchWeather("weather");
          break;

        case "2":
          await searchWeather("humidity");
          break;

        case "3":
          await searchWeather("forecast");
          break;

        case "4": {
          const city = await ask("Enter city to add: ");

          if (city) {
            addCity(city);
          } else {
            console.log(chalk.red("Please enter a city name."));
          }
          break;
        }

        case "5":
          listCities();
          break;

        case "6": {
          const city = await ask("Enter city to remove: ");

          if (city) {
            removeCity(city);
          } else {
            console.log(chalk.red("Please enter a city name."));
          }
          break;
        }

        case "7":
          running = false;
          console.log(
            chalk.green("\nThank you for using Rwanda Weather!")
          );
          break;

        default:
          console.log(
            chalk.red("Invalid option. Please choose from 1 to 7.")
          );
      }
    } catch (error) {
      console.log(chalk.red(`Error: ${error.message}`));
    }
  }

  rl.close();
}

// Handle Ctrl + C
rl.on("SIGINT", () => {
  running = false;

  console.log(
    chalk.green("\nRwanda Weather stopped. Goodbye!")
  );

  rl.close();
  process.exit(0);
});

// Start the application
runMenu().catch((error) => {
  console.error(
    chalk.red("Application error:"),
    error.message
  );

  rl.close();
  process.exitCode = 1;
});
