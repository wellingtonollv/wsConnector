const WebSocket = require('ws');

const wsURL = 'wss://ultra.serveo.net'
const oculus = require('./oculus.js')

const heartRateDataArray = []; // Store received heart rate data

const proccessHeartRateData = (heartRateData) => {
  const heartRate = heartRateData;
  console.log(heartRate, 'heart rate', heartRateDataArray)

  heartRateDataArray.push(heartRate);

  // Divide the data into time intervals (e.g., 1 minute)
  const intervalMinutes = 1;
  const intervalMilliseconds = intervalMinutes * 60 * 1000;
  const now = new Date().getTime();
  const intervalData = heartRateDataArray.filter((data) => (now - data.timestamp) <= intervalMilliseconds);

  // Calculate the average heart rate in the current interval
  const intervalAverage = intervalData.reduce((sum, data) => sum + data.heartRate, 0) / intervalData.length;

  // Calculate the average for a reference period (e.g., average of the 1 minute)
  const referenceData = heartRateDataArray.filter((data) => (now - data.timestamp) <= intervalMilliseconds * 2);
  const referenceAverage = referenceData.reduce((sum, data) => sum + data.heartRate, 0) / referenceData.length;

  // Compare the current average with the reference average
  if (intervalAverage > referenceAverage) {
    // The current average heart rate is higher than the reference average, indicating possible stress
    console.log('The user is stressed!');

    const factor = 0.5 + (intervalAverage - referenceAverage) / referenceAverage;
    const brightnessValue = Math.round(factor * 255);

    oculus.setOculusBrightness(brightnessValue);
  }
};

const createWebSocketConnection = () => {
  const ws = new WebSocket(wsURL);

  // Event listener for connection established
  ws.on('open', () => {
    console.log('WebSocket connection established');
  });

  // Event listener for connection closed
  ws.on('close', (code, reason) => {
    console.log(`WebSocket connection closed with code ${code} and reason '${reason}'`);

    // Reconnect after a timeout
    setTimeout(() => {
      console.log('Reconnecting...');
      createWebSocketConnection();
    }, 3000); // Adjust the timeout duration as needed
  });

  // Event listener for errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    ws.close(); // Close the connection on error
  });

  // Event listener for receiving messages
  ws.on("message", function (data) {
    const bufferString = data.toString("utf8");
    // Parse the string back to a JSON object
    const {method, params} = JSON.parse(bufferString);
    if(method === 'HEART_RATE') {
      const {currentHeartRate} = params;
      proccessHeartRateData(currentHeartRate);
    } 
  });
};

// Start the initial WebSocket connection
createWebSocketConnection();
