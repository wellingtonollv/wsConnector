const adb = require("adbkit");
const client = adb.createClient();
const env  = require('dotenv').config();

async function setOculusBrightness(brightnessValue) {
  // 0 - 255 (0 is off, 255 is full brightness)
  try {
    // Find the device ID
    const devices = await client.listDevices();
    const device = devices.find((device) => device.id.includes(process.env.OCULUS_DEVICE_ID));
    // Set the brightness
    await client.shell(device.id, `settings put system screen_brightness ${brightnessValue}`);
    console.log(`Oculus brightness set to ${brightnessValue}`);
  } catch (error) {
    console.error(`Failed to set Oculus brightness: ${error}`);
  }
}

module.exports = {
  setOculusBrightness
};
