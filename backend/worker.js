const { spawn } = require('child_process');
const path = require('path');

function generateFrames(description) {
  return new Promise((resolve, reject) => {
    // נתיב מוחלט לסקריפט Python
    const scriptPath = path.join(__dirname, "../colab/generate_frames.py");
    console.log("Running script at:", scriptPath);

    const process = spawn("python", [scriptPath, description]);

    process.stdout.on("data", data => console.log(`stdout: ${data.toString()}`));
    process.stderr.on("data", data => console.error(`stderr: ${data.toString()}`));

    process.on("close", code => {
      console.log("Process exited with code:", code);
      if (code === 0) {
        resolve("colab/frames/"); // תיקיית פריימים
      } else {
        reject("Error generating frames");
      }
    });
  });
}

module.exports = { generateFrames };
