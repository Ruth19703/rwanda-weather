import fs from "fs";
import path from "path";
import chalk from "chalk";

const filePath = path.join(process.cwd(), "cities.json");

// Read saved cities
function getCities() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(chalk.red("Error reading saved cities."));
    return [];
  }
}

// Save cities
function saveCities(cities) {
  fs.writeFileSync(filePath, JSON.stringify(cities, null, 2));
}

// Add a favorite city
export function addCity(city) {
  if (!city || !city.trim()) {
    console.log(chalk.red("Please provide a city name."));
    return;
  }

  const cities = getCities();

  if (cities.some((savedCity) => savedCity.toLowerCase() === city.toLowerCase())) {
    console.log(chalk.yellow(`${city} is already saved.`));
    return;
  }

  cities.push(city);
  saveCities(cities);

  console.log(chalk.green(`${city} has been added to your favorite cities!`));
}

// List favorite cities
export function listCities() {
  const cities = getCities();

  if (cities.length === 0) {
    console.log(chalk.yellow("No favorite cities saved yet."));
    return;
  }

  console.log(chalk.blue("\nYour Favorite Cities:"));

  cities.forEach((city, index) => {
    console.log(`${index + 1}. ${city}`);
  });
}

// Remove a favorite city
export function removeCity(city) {
  const cities = getCities();

  const updatedCities = cities.filter(
    (savedCity) => savedCity.toLowerCase() !== city.toLowerCase()
  );

  if (updatedCities.length === cities.length) {
    console.log(chalk.red(`${city} was not found in your favorite cities.`));
    return;
  }

  saveCities(updatedCities);
  console.log(chalk.green(`${city} has been removed.`));
}