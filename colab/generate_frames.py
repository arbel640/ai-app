import sys
import os

description = sys.argv[1]
frames_dir = "frames"

# צור תיקיית פריימים אם לא קיימת
os.makedirs(frames_dir, exist_ok=True)

# לדוגמה – יוצרים 5 תמונות placeholder
for i in range(5):
    file_path = os.path.join(frames_dir, f"frame_{i+1}.png")
    with open(file_path, "w") as f:
        f.write(f"Frame {i+1} for description: {description}")

print("Frames generated successfully")
