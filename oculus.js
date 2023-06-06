const adb = require("adbkit");
const client = adb.createClient();

async function setOculusBrightness(brightnessValue) {
  try {
    // Find the device ID
    const devices = await client.listDevices();
    const device = devices.find((d) => d.id.includes(process.env.DEVICE_ID));

    // Set the brightness
    await client.shell(device.id, `settings put system screen_brightness ${brightnessValue}`);
  } catch (error) {
    console.error(`Failed to set Oculus brightness: ${error}`);
  }
}

exports.handler = async (event) => {
  const brightnessValue = event.brightnessValue;
  await setOculusBrightness(brightnessValue);
  return {
    statusCode: 200,
    body: JSON.stringify("Brightness set successfully"),
  };
};
