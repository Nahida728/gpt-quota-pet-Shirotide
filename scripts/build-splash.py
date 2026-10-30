"""Encode a local mascot GIF; no runtime dependencies or external media reads."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math

root = Path(__file__).resolve().parent.parent
assets = root / 'src/renderer/assets'
sprite = Image.open(assets / 'gpt-pet.png').convert('RGBA')
sprite.thumbnail((210, 210), Image.Resampling.LANCZOS)
frames = []
for index in range(40):
    phase = index / 40 * math.tau
    image = Image.new('RGBA', (256, 256))
    shadow = Image.new('RGBA', image.size)
    draw = ImageDraw.Draw(shadow)
    spread = 30 + math.sin(phase) * 3
    draw.ellipse((128-spread, 218, 128+spread, 227), fill=(117, 123, 173, 38))
    image.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(4)))
    pose = sprite.rotate(math.sin(phase) * 2.8, Image.Resampling.BICUBIC, expand=True)
    image.alpha_composite(pose, ((256-pose.width)//2, round(4 + math.cos(phase) * 4)))
    draw = ImageDraw.Draw(image)
    for dot in range(3):
        level = (math.sin(phase - dot * .9) + 1) / 2
        radius = 2.8 + level
        x = 114 + dot * 14
        draw.ellipse((x-radius, 241-radius, x+radius, 241+radius), fill=(72, 164, 190, round(90+level*165)))
    frames.append(image)
# One global palette avoids frame-to-frame color shimmer. Reserve 255 for alpha.
palette = frames[0].convert('RGB').quantize(colors=255).getpalette()
palette = (palette + [0] * 768)[:765] + [0, 0, 0]
table = Image.new('P', (1, 1)); table.putpalette(palette)
encoded = []
for frame in frames:
    image = frame.convert('RGB').quantize(palette=table, dither=Image.Dither.NONE)
    image.paste(255, mask=frame.getchannel('A').point(lambda alpha: 255 if alpha < 100 else 0))
    image.info['transparency'] = 255
    encoded.append(image)
encoded[0].save(assets / 'shirotide-loading.gif', save_all=True, append_images=encoded[1:],
                loop=0, duration=50, disposal=2, transparency=255, optimize=False)
frames[0].save(assets / 'shirotide-loading.png')
print('Mascot GIF: 256 x 256, 40 frames, 2 seconds, static reduced-motion fallback')
