const WebSocket = require('ws');

const createWebSocketConnection = () => {
  const ws = new WebSocket('ws://localhost:8080');

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
    const jsonObject = JSON.parse(bufferString);
    console.log(jsonObject);
  });
};

// Start the initial WebSocket connection
createWebSocketConnection();
