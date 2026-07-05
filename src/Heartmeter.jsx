import heartImage from './assets/heart.png';

//outline-only heart, used as the 'empty' background layer under the fill
const HEART_OUTLINE_PATH =
  "M12 21s-6.716-4.35-9.428-8.014C.815 10.406 1 7.5 3.343 5.657 5.686 3.814 8.5 4.5 10 6.5c.5.667 1 1.333 2 1.333s1.5-.666 2-1.333c1.5-2 4.314-2.686 6.657-.843C22 7.5 23.185 10.406 21.428 12.986 18.716 16.65 12 21 12 21z";
 
const HEART_METER_SIZE = 5;   //number of hearts in the meter
const HEART_ICON_SIZE = 22;   //px, width/height of each heart in the meter
 
//Renders task-completion progress as a row of hearts (out of HEART_METER_SIZE),
//using heartImage for the filled portion and an outline-only SVG for the rest.
//Hearts can be partially filled - e.g. at 42% with 5 hearts, the 3rd heart
//is filled ~10% of the way, since each heart represents a 20% slice.
function HeartMeter({ tasksCompleted = 0, tasksTotal = 0 }) {
 
    //percentage of tasks completed, guarding against tasksTotal being 0
    const rawPercent = tasksTotal > 0 ? (tasksCompleted * 100) / tasksTotal : 0;
    const percent = Math.min(100, Math.max(0, rawPercent));
 
    return (
        <div
          className="heartMeter"
          role="img"
          aria-label={`${tasksCompleted} of ${tasksTotal} tasks completed`}
        >
          {Array.from({ length: HEART_METER_SIZE }).map((_, i) => {
            //how full THIS heart is, 0-100, based on the slice of the
            //bar it covers (each heart = 20% of the total progress)
            const heartFill = Math.min(
              100,
              Math.max(0, (percent - i * (100 / HEART_METER_SIZE)) / (100 / HEART_METER_SIZE) * 100)
            );
 
            return (
              <span
                className="heartMeterHeart"
                key={i}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: HEART_ICON_SIZE,
                  height: HEART_ICON_SIZE,
                }}
              >
                {/* empty state: outline only, always visible underneath the fill */}
                <svg
                  className="heartOutline"
                  viewBox="0 0 24 24"
                  width={HEART_ICON_SIZE}
                  height={HEART_ICON_SIZE}
                >
                  <path d={HEART_OUTLINE_PATH} fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
 
                {/* filled state: the actual heart image, clipped to heartFill% width
                    so a heart can be partially filled rather than only all-or-nothing */}
                <div
                  className="heartFillClip"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${heartFill}%`,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    className="heartFillImage"
                    src={heartImage}
                    alt=""
                    width={HEART_ICON_SIZE}
                    height={HEART_ICON_SIZE}
                    style={{ display: 'block' }}
                  />
                </div>
              </span>
            );
          })}
        </div>
    );
}
 
export default HeartMeter;
 
