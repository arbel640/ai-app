from diffusers import StableDiffusionPipeline
import torch
import os
import sys

# ------------------------------
# קלט: תיאור הסרטון (description) מ־argv
# ------------------------------
if len(sys.argv) > 1:
    description = sys.argv[1]
else:
    description = "red car racing in sunset"  # ברירת מחדל

# תיקייה לשמירת פריימים
FRAMES_DIR = "/content/frames"
os.makedirs(FRAMES_DIR, exist_ok=True)

# ------------------------------
# יצירת Pipeline של Stable Diffusion
# ------------------------------
pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16
)
pipe = pipe.to("cuda")  # אם יש GPU ב-Colab, אחרת "cpu"

# ------------------------------
# יצירת פריימים
# ------------------------------
NUM_FRAMES = 5
frame_paths = []

for i in range(NUM_FRAMES):
    image = pipe(description, guidance_scale=7.5).images[0]
    frame_path = os.path.join(FRAMES_DIR, f"frame_{i}.png")
    image.save(frame_path)
    frame_paths.append(frame_path)
    print(f"✅ Saved frame: {frame_path}")

# ------------------------------
# יצירת וידאו עם ffmpeg
# ------------------------------
VIDEO_PATH = os.path.join(FRAMES_DIR, "video.mp4")
FPS = 2  # פריימים לשנייה
ffmpeg_cmd = f"ffmpeg -r {FPS} -i {FRAMES_DIR}/frame_%d.png -vcodec libx264 -pix_fmt yuv420p {VIDEO_PATH} -y"
os.system(ffmpeg_cmd)

print(f"🎬 Video saved at: {VIDEO_PATH}")
