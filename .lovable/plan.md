

## Plan: Make hero background appear 2 seconds earlier

The hero background (`hero-bg.jpg`) currently waits for `doorHidden` (triggered at 10s). To show it 2 seconds earlier, I'll add a new state `heroVisible` that triggers at 8 seconds (8000ms), and use that state to control the hero background fade-in instead of `doorHidden`.

### Changes

**`src/pages/Index.tsx`**:
1. Add a new state: `const [heroVisible, setHeroVisible] = useState(false)`
2. Reset it in the animation useEffect: `setHeroVisible(false)`
3. Add a new timer in `startAnimation`: `setTimeout(() => setHeroVisible(true), 8000)`
4. Change the hero background div condition from `doorHidden` to `heroVisible`

This way the background starts fading in at 8s with a 2s transition, fully visible by 10s when the door disappears.

