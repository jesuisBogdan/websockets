const WebSocket = require('ws');
const getWeather = require('./weather');
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('Server is running on port 8080');
});

wss.on('connection', async (ws) => {
  console.log('New client connected');

  ws.send(
    'Let`s test your weather forecasting skills: What`s the temperature in Bucharest right now, in Celsius?'
  );
  const weather = await getWeather();
  console.log(typeof weather);
  ws.on('message', (message) => {
    console.log(`Client message: ${message}`);
    if (!+message) {
      ws.send('Please respond only with numbers');
    }
    if (+message === weather) {
      ws.send(
        `Congrats, you won! Now there are ${weather}C in Bucharest.`
      );

      setTimeout(() => {
        wss.close();
        console.log('Server has closed');
        process.exit();
      }, 2000);
    } else if (+message < weather) {
      ws.send('Wormer');
    } else if (+message > weather) {
      ws.send('Colder');
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
