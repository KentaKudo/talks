# Freestyle session preparation

## Before the event

- **Confirm the slot:** the full script was estimated at 22–24 minutes. Confirm whether questions count toward the advertised time; rehearse the cue sheet aloud with the actual demos. Set section checkpoints from that run, not from reading speed.
- **Choose the short route ahead of time:** for 20 minutes, mark `next-agents`, `compiler-history`, and `next-compiler` optional. Shorten the browser history and release roundups. Keep the two demos, Start's data path, Redact's scheduling tradeoff, and the measurement caveats.
- **Pick one audience language for projection:** Japanese is the existing default. Speaking English over Japanese slides can help a Japanese-speaking audience; switch speech when useful without repeatedly changing projected language. Share the deck so readers can choose their own language and pace.
- **Rehearse transitions, not paragraphs:** practice the opening, the five section handoffs, and the closing. Use the memo's bold point as each slide's destination; allow spontaneous examples or audience reactions between those anchors.
- **Decide how to present measurements:** the size and build-time results are explicitly historical, before content expansion. Keeping them as recorded evidence is fine. If you want current numbers, run `npm run compare:builds` for sizes/emitted code and repeat the timing experiment separately; update slides, memo, transcript, and scope together. The existing timing results have no raw per-run log in this repo.

## Useful additions to consider

- **Share link / QR:** put the final published deck URL in the event description and consider a QR on the first/last slide after testing the destination on a phone. The documented Pages destination is [kentakudo.github.io/talks/react-catchup-nov26/](https://kentakudo.github.io/talks/react-catchup-nov26/); verify publication before putting it on screen. Current edits are reviewable in a PR, not automatically deployed.
- **Recorded demo backups:** capture a short clip of each successful demo on the presentation machine. Keep clips local and test playback; the Code tabs are already a fallback if you choose not to record.
- **One audience interaction:** Start's “who has tried it?” is already in the memo. Allow a brief show of hands; leave deeper comparisons for Q&A so the talk keeps moving.
- **Second-language review:** ask someone comfortable in the projected language to read a few technical slides silently and explain the point back. This checks whether the slides work without hearing your narration.

## On the presentation machine

Use Node.js 24 and the production build. From `react-catchup-nov26/`:

```sh
npm ci
npm run build
npm run preview
```

Open [localhost:4173](http://localhost:4173). Keep the preview process running. Restart preview after rebuilding. Assets and demos are local; external source links need a connection.

- Use a browser you have tested with both native React demos. Check reduced-motion settings; a card changing without animation may be expected under those preferences.
- Extend displays. Put only the deck window on the projector and use `F` for slide-only fullscreen. Keep `speaker-memo.md` on the private screen or a tablet; it scrolls manually. Verify the audience cannot see it when you switch windows.
- With the projector attached, check the smallest code and footer text from the back of the room. Avoid solving unreadability by talking faster; pause and point to the important line.
- Test your clicker: arrows / Page Down / Page Up. `O` opens overview, `Esc` closes it, `F` toggles fullscreen. A clicker cannot navigate the deck while focus stays inside a demo iframe; click outside the demo first.
- Transition demo: reset to Tokyo → click next → confirm Kyoto and the motion → Code tab → return to Demo → reset.
- Fragment demo: reset → confirm 1 / 3 → scroll within feed to 2 / 3, then all seen → Code tab → return → reset.
- Return to the opening slide in the intended projected language. Prevent sleep and notification interruptions; keep a charger and display adapter nearby.

## If something goes wrong

| Situation | Recovery |
| --- | --- |
| Forgot the next point | Read the slide's takeaway; glance at the matching memo number; move on. |
| Animation absent | Mention browser/motion preferences, use Code, describe the intended cross-fade. |
| Demo interaction fails | Use Code or a prepared local clip. Spend one attempt, not the rest of the section. |
| Lost slide / accidental jump | `O`, select the slide by title, `Esc` if needed. |
| Behind schedule | Take optional slides in one sentence or skip via overview; preserve the caveats and closing. |
| Internet unavailable | Continue with the local build; leave source links and audience downloads for later. |

## Just before starting

Memo visible privately. Deck opening visible publicly. Both demos reset. Timer ready. One breath, greet the room, start with why you wanted to catch up.
