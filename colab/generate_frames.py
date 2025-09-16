from diffusers import StableDiffusionPipeline
import torch
import os

description = "red car racing in sunset"  # זה יגיע מה־argv
frames_path = "colab/frames/"
os.makedirs(frames_path, exist_ok=True)

pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
pipe = pipe.to("cuda")  # אם יש לך GPU, אחרת "cpu"

for i in range(5):
    image = pipe(description).images[0]
    image.save(os.path.join(frames_path, f"frame_{i}.png"))
