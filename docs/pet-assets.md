# GPT-白汐 / GPT-Shirotide assets

The pet uses one AI-generated transparent master, `src/renderer/assets/gpt-pet.png`.
Its transparent outer columns have been losslessly trimmed from 1254 × 1254 to
1159 × 1254. `gpt-pet.json` records its SHA-256 and a source rectangle of
1070 × 1243 at (58, 0), excluding the barely visible alpha fringe below 8/255.
The renderer samples that rectangle directly without altering the master pixels.
Visible height defaults to 256 DIP and both axes use one scale. Physics uses
these visible dimensions without a screen-edge inset; spring canvas padding
is excluded from collisions.
Breathing and press feedback use one alpha canvas and the unchanged source
pixels. Each changed frame first clears the entire previous canvas; there is
no second visible DOM sprite or stack of transformed image textures.
The pet always keeps the master sprite's original orientation; position and
flight direction never mirror the image.

Generation prompt used for the master:

> Use case: stylized-concept. Asset type: a single production desktop-pet master
> sprite for a Windows GPT quota monitor. Use the supplied image as character and
> style reference only. Create an original adorable GPT companion: fluffy long
> pearl-white hair with a slight lavender tint, lavender eyes, ivory curved dragon
> horns, a six-loop GPT knot hair ornament, a tiny dragon tail and small cloak
> wings. A modest white and pale sky-cyan robe with silver/lilac trims and oversized
> sleeves. Chibi 2.5-head proportions, a round smiling face, one hand waving,
> front three-quarter view, full body. Clean anime cel shading, transparent
> background, exactly one character. No room, luggage, text, watermarks or floor.

The bubble follows the default classic frame geometry from
[MeteorNOX/DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget).
The path and two detached circles retain their relative geometry. Only palette
changes: fill `#f2fbff`, outline `#8b9fc7`. The SVG viewBox removes transparent
outer margin without cutting visible artwork. `pet-bubble.png` is its 2× raster.
The upstream MIT notice is retained in `pet-bubble.LICENSE` beside the assets.
Use this same master for future bubble variants.

The default bubble is 256 DIP wide. Its content has two stacked quota rows,
each with a label, remaining percentage and full-width bar. Clicking cycles
closed → quotas → chatter → closed, with a seven-second timeout for each phase.
Chatter is picked with weights and no immediate repetition.

`src/pet-chatter.js` is the local bilingual catchphrase pool. Keep its wording
unchanged. No source labels, links or extra header appear inside the bubble.

The original bubble sequence also inspired the interaction. No upstream script
is executed or packaged. The two-part small yellow duck sound uses the original
`Ya1.mp3` / `Ya2.mp3` bytes as `pet-duck-press.mp3` / `pet-duck-release.mp3`.
`pet-duck.NOTICE` records the pinned source and upstream as-is asset terms;
these audio assets are not relicensed under the upstream code's MIT license.
Playback stays local and obeys the interaction sound setting. New profiles have
sound enabled; an explicitly saved mute remains muted.

## Application icon and splash

The application icon was made with the built-in imagegen tool, using the existing
pet as the identity reference. Master: `assets/shirotide-icon-master.png`.
`scripts/build-icons.js` derives `assets/icon.ico` (16/24/32/48/64/128/256 px), both
tray files and `src/renderer/assets/shirotide-icon.png` from this one master.
No branding identity or data directory changes with the icon.

Final generation prompt:

> Use case: logo-brand. Asset type: one polished Windows desktop application icon
> master for GPT-Shirotide / GPT-白汐. Reference image: the existing white dragon
> chibi mascot; preserve white pearl/lavender hair, two ivory horns, violet eyes,
> happy small open smile and loop-knot hair ornament. Single bold square icon:
> close head and upper-shoulders portrait, large centered face, horns visible,
> simplified broad cel-shaded shapes readable at 32px. Soft rounded-square tile
> in icy cyan to lilac, restrained darker teal lower edge. Head/horns slightly
> outside the tile, all artwork with transparent outer margin. Premium anime
> finish, crisp edges and minimal highlights. No text, badges, mockups, multiple
> variants or tiny full-body figure. Genuinely transparent exterior.

`scripts/build-splash.py` encodes the existing full-body pet with gentle uniform
tilt/bobbing and three loading dots as `shirotide-loading.gif`: 256px, 40 frames,
50ms/frame, two-second loop. `shirotide-loading.png` is its reduced-motion fallback.
The GIF is local, with no remote content or new runtime dependencies.
