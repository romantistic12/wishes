# A Birthday Wish 🤍

A small, self-contained birthday page: click the gold seal to open a
hand-typed letter, with soft music, drifting neon hearts, and gentle
sparkles in a lavender / white / beige / black / gold palette.

## Files

- `index.html` — page structure
- `style.css` — theme, layout, animations
- `script.js` — sparkles, floating hearts, typewriter effect, music

## Customize it

Open `script.js` and edit the block at the very top:

```js
const RECIPIENT_NAME = "you";       // their name
const WISH_TEXT = `...`;            // your message — line breaks are preserved
const CUSTOM_AUDIO_PATH = null;     // e.g. "song.mp3" to use your own track
```

If you leave `CUSTOM_AUDIO_PATH` as `null`, the page plays a soft,
synthesized rendition of the traditional "Happy Birthday" melody
(public domain) generated in-browser — no audio file needed.

To use your own song instead: drop an mp3 (e.g. `song.mp3`) into this
folder, and set `CUSTOM_AUDIO_PATH = "song.mp3"`.

## Running it

Just open `index.html` in any browser — no build step, no server,
no dependencies beyond a Google Fonts link.

## Notes

- Music starts on the click that opens the letter, respecting browser
  autoplay rules. A small toggle in the bottom-right corner lets the
  recipient mute/unmute afterward.
- Respects `prefers-reduced-motion` for anyone who has that set.
