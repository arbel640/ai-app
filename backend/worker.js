const { spawn } = require('child_process');
const path = require('path');

function generateFrames(description) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../colab/generate_frames.py");
    console.log("Running script at:", scriptPath);

    const process = spawn("python", [scriptPath, description]);

    process.stdout.on("data", data => console.log(`stdout: ${data.toString()}`));
    process.stderr.on("data", data => console.error(`stderr: ${data.toString()}`));

    process.on("close", code => {
      console.log("Process exited with code:", code);
      if (code === 0) {
        resolve("frames/video.mp4"); // נתיב יחסי ל־Express static route
      } else {
        reject("Error generating frames");
      }
    });
  });
}

module.exports = { generateFrames };
