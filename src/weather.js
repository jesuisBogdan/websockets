const { fetchWeatherApi } = require('openmeteo');

async function getWeather() {
  const params = {
    latitude: 44.439663,
    longitude: 26.096306,
    hourly: 'temperature_2m'
  };
  const url = 'https://api.open-meteo.com/v1/forecast';
  const responses = await fetchWeatherApi(url, params);

  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const hourly = response.hourly();

  const weatherData = {
    hourly: {
      time: Array.from(
        {
          length:
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
            hourly.interval()
        },
        (_, i) =>
          new Date(
            (Number(hourly.time()) +
              i * hourly.interval() +
              utcOffsetSeconds) *
              1000
          )
      ),
      temperature2m: hourly.variables(0).valuesArray()
    }
  };

  const now = new Date();

  let closestIndex = 0;
  let closestDifference = Infinity;
  for (let i = 0; i < weatherData.hourly.time.length; i++) {
    const difference = Math.abs(now - weatherData.hourly.time[i]);
    if (difference < closestDifference) {
      closestIndex = i;
      closestDifference = difference;
    }
  }

  return Math.round(weatherData.hourly.temperature2m[closestIndex]);
}

module.exports = getWeather;
