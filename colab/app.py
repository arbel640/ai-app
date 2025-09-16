from flask import Flask, request, jsonify
from flask_cors import CORS
import queue
import threading
import time

app = Flask(__name__)
CORS(app)

# תור Jobs
job_queue = queue.Queue()
jobs = {}

def worker():
    while True:
        job_id, text = job_queue.get()
        print(f"עובד על Job {job_id} עם טקסט: {text}")
        time.sleep(5)  # סימולציה של יצירת וידאו
        jobs[job_id]["status"] = "done"
        jobs[job_id]["url"] = f"https://example.com/video_{job_id}.mp4"
        job_queue.task_done()

threading.Thread(target=worker, daemon=True).start()

@app.route("/submit", methods=["POST"])
def submit_job():
    data = request.json
    text = data.get("text", "")
    job_id = str(len(jobs) + 1)
    jobs[job_id] = {"status": "processing", "url": None}
    job_queue.put((job_id, text))
    return jsonify({"job_id": job_id})

@app.route("/status/<job_id>")
def check_status(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job)

if __name__ == "__main__":
    app.run(port=3000)
