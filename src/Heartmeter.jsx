import heartImage from './assets/FilledHeart.png';
import heartBackground from './assets/heartBase.png';

//outline-only heart, used as the 'empty' background layer under the fill
const HEART_OUTLINE_PATH = heartBackground;
const HEART_METER_SIZE = 10;  //max purchasable hearts
const HEART_ICON_SIZE = 22;   //px, width/height of each heart in the meter

//Renders purchased hearts as a row of HEART_METER_SIZE icons. Each heart is
//bought as a whole unit (via TaskTracking's buy button), so there's no
//partial-fill state anymore — a heart is either owned (filled) or not
//yet purchased (outline only).
function Heartmeter({ heartsOwned = 0 }) {

    const filledCount = Math.min(HEART_METER_SIZE, Math.max(0, heartsOwned));

    return (
        <div
          className="Heartmeter"
          role="img"
          aria-label={`${filledCount} of ${HEART_METER_SIZE} hearts purchased`}
        >
          {Array.from({ length: HEART_METER_SIZE }).map((_, i) => {
            const isFilled = i < filledCount;

            return (
              <span
                className="HeartmeterHeart"
                key={i}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: HEART_ICON_SIZE,
                  height: HEART_ICON_SIZE,
                }}
              >


                {/* filled state: the actual heart image, shown once this heart has been bought */}
                {isFilled && (
                  <div
                    className="heartFillClip"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: '100%',
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
                )}
              </span>
            );
          })}
        </div>
    );
}

export default Heartmeter;