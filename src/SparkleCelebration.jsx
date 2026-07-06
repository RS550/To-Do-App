import React from 'react';

//A four-pointed 'sparkle' glyph (the classic magic/celebration icon shape)
const SPARKLE_PATH = "M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z";

const SPARKLE_COUNT = 500;

//how long each individual sparkle takes to fall + fade, in seconds
const FALL_DURATION_MIN = 1.8;
const FALL_DURATION_MAX = 3.5;

//stagger so they don't all start at once
const START_DELAY_MAX = 0.8;

//overlay auto-dismisses shortly after the last sparkle would have finished
const AUTO_DISMISS_MS = (START_DELAY_MAX + FALL_DURATION_MAX) * 1000 + 400;

const SPARKLE_COLORS = ['#f6f2e9' ,'#e9ce64', '#f0d193'];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

//Full-screen, mostly-transparent overlay that plays a single burst of
//falling sparkles, then removes itself. Triggered by the `active` prop
//going from false -> true (e.g. all tasks just got marked completed);
//it does not replay again while `active` stays true.
function SparkleCelebration({ active }) {
  const [visible, setVisible] = React.useState(false);
  const [sparkles, setSparkles] = React.useState([]);
  const wasActiveRef = React.useRef(false);

  React.useEffect(() => {
    const justBecameActive = active && !wasActiveRef.current;
    wasActiveRef.current = active;

    if (!justBecameActive) return;

    //generate one batch of sparkles with randomized position/size/timing
    const generated = Array.from({ length: SPARKLE_COUNT }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,               // vw
      drift: randomBetween(-40, 40),            // px, horizontal drift while falling
      size: randomBetween(10, 22),              // px
      delay: randomBetween(0, START_DELAY_MAX), // s
      duration: randomBetween(FALL_DURATION_MIN, FALL_DURATION_MAX), // s
      color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
    }));

    setSparkles(generated);
    setVisible(true);

    const dismissTimer = setTimeout(() => setVisible(false), AUTO_DISMISS_MS);
    return () => clearTimeout(dismissTimer);
  }, [active]);

  if (!visible) return null;

  return (
    <div className="sparkleOverlay" aria-hidden="true">
      <style>{`
        @keyframes sparkleFall {
          0% {
            transform: translate(0, -10vh) rotate(0deg) scale(0.6);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--sparkle-drift), 110vh) rotate(180deg) scale(1);
            opacity: 0;
          }
        }
      `}</style>
      {sparkles.map((s) => (
        <svg
          key={s.id}
          className="sparkle"
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          style={{
            position: 'absolute',
            top: 0,
            left: `${s.left}vw`,
            '--sparkle-drift': `${s.drift}px`,
            animation: `sparkleFall ${s.duration}s ease-in ${s.delay}s forwards`,
          }}
        >
          <path d={SPARKLE_PATH} fill={s.color} />
        </svg>
      ))}
    </div>
  );
}

export default SparkleCelebration;