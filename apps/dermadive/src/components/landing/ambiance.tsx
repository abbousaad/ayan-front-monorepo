import type { CSSProperties } from 'react';

/*
 * Decorative per-product ambiances, ported verbatim from the design's inline SVG:
 *   NettoDive — water, rising bubbles, lavender sprigs
 *   SunDive   — warmth + rotating sun rays
 *   EclaDive  — radiant burst + twinkling sparks
 * All purely presentational (aria-hidden); animation lives in index.css and is
 * disabled under prefers-reduced-motion.
 */

type BubbleSpec = { x: string; s: string; t: string; d: string; o: string };

const BUBBLES: BubbleSpec[] = [
  { x: '32.4%', s: '25px', t: '21.5s', d: '-1.4s', o: '0.67' },
  { x: '36.4%', s: '21px', t: '19.6s', d: '-0.7s', o: '0.63' },
  { x: '8.6%', s: '22px', t: '18.5s', d: '-16.5s', o: '0.49' },
  { x: '23.0%', s: '41px', t: '25.3s', d: '-11.5s', o: '0.61' },
  { x: '93.8%', s: '21px', t: '24.2s', d: '-5.8s', o: '0.49' },
  { x: '13.1%', s: '30px', t: '23.6s', d: '-3.6s', o: '0.69' },
  { x: '62.1%', s: '32px', t: '20.1s', d: '-1.3s', o: '0.46' },
  { x: '21.4%', s: '43px', t: '18.6s', d: '-6.3s', o: '0.69' },
  { x: '44.6%', s: '29px', t: '23.3s', d: '-14.0s', o: '0.54' },
  { x: '56.0%', s: '37px', t: '24.4s', d: '-14.6s', o: '0.56' },
  { x: '94.1%', s: '24px', t: '18.4s', d: '-15.1s', o: '0.50' },
  { x: '48.0%', s: '21px', t: '21.7s', d: '-15.3s', o: '0.69' },
  { x: '84.3%', s: '30px', t: '22.0s', d: '-11.9s', o: '0.69' },
  { x: '44.9%', s: '48px', t: '25.3s', d: '-9.5s', o: '0.73' }
];

type SparkSpec = BubbleSpec & { y: string };

const SPARKS: SparkSpec[] = [
  { x: '18.2%', y: '65.3%', s: '51px', t: '5.3s', d: '-1.3s', o: '0.92' },
  { x: '77.3%', y: '50.1%', s: '45px', t: '4.2s', d: '-0.0s', o: '0.68' },
  { x: '56.9%', y: '12.0%', s: '57px', t: '4.2s', d: '-1.4s', o: '0.50' },
  { x: '94.8%', y: '69.5%', s: '62px', t: '5.8s', d: '-0.2s', o: '0.66' },
  { x: '48.8%', y: '16.0%', s: '64px', t: '4.8s', d: '-0.9s', o: '0.93' },
  { x: '14.5%', y: '85.8%', s: '44px', t: '5.6s', d: '-2.1s', o: '0.75' },
  { x: '20.2%', y: '9.2%', s: '62px', t: '4.2s', d: '-4.7s', o: '0.59' },
  { x: '92.1%', y: '82.9%', s: '56px', t: '6.5s', d: '-3.5s', o: '0.88' },
  { x: '14.3%', y: '47.0%', s: '59px', t: '4.1s', d: '-5.5s', o: '0.95' },
  { x: '40.7%', y: '37.4%', s: '43px', t: '4.9s', d: '-6.0s', o: '0.69' },
  { x: '5.5%', y: '14.0%', s: '55px', t: '7.5s', d: '-3.0s', o: '0.75' }
];

const SPARK_PATH =
  'M12 0C13.1 8.4 15.6 10.9 24 12C15.6 13.1 13.1 15.6 12 24C10.9 15.6 8.4 13.1 0 12C8.4 10.9 10.9 8.4 12 0Z';

const WAVE_PATHS = [
  'M0 30.0 L10 32.3 L20 34.2 L30 35.5 L40 36.0 L50 35.5 L60 34.2 L70 32.3 L80 30.0 L90 27.7 L100 25.8 L110 24.5 L120 24.0 L130 24.5 L140 25.8 L150 27.7 L160 30.0 L170 32.3 L180 34.2 L190 35.5 L200 36.0 L210 35.5 L220 34.2 L230 32.3 L240 30.0',
  'M0 49.9 L10 50.4 L20 50.2 L30 49.3 L40 48.0 L50 46.3 L60 44.6 L70 43.1 L80 42.1 L90 41.6 L100 41.8 L110 42.7 L120 44.0 L130 45.7 L140 47.4 L150 48.9 L160 49.9 L170 50.4 L180 50.2 L190 49.3 L200 48.0 L210 46.3 L220 44.6 L230 43.1 L240 42.1',
  'M0 64.3 L10 63.5 L20 62.4 L30 61.3 L40 60.4 L50 59.6 L60 59.2 L70 59.3 L80 59.7 L90 60.5 L100 61.6 L110 62.7 L120 63.6 L130 64.4 L140 64.8 L150 64.7 L160 64.3 L170 63.5 L180 62.4 L190 61.3 L200 60.4 L210 59.6 L220 59.2 L230 59.3 L240 59.7',
  'M0 77.8 L10 77.4 L20 77.0 L30 76.8 L40 76.8 L50 77.0 L60 77.3 L70 77.7 L80 78.2 L90 78.6 L100 79.0 L110 79.2 L120 79.2 L130 79.0 L140 78.7 L150 78.3 L160 77.8 L170 77.4 L180 77.0 L190 76.8 L200 76.8 L210 77.0 L220 77.3 L230 77.7 L240 78.2'
];

const SUN_RAYS = [
  [236.0, 150.0, 266.0, 150.0], [230.8, 179.4, 247.7, 185.6], [215.9, 205.3, 238.9, 224.6],
  [193.0, 224.5, 202.0, 240.1], [164.9, 234.7, 170.1, 264.2], [135.1, 234.7, 131.9, 252.4],
  [107.0, 224.5, 92.0, 250.5], [84.1, 205.3, 70.3, 216.8], [69.2, 179.4, 41.0, 189.7],
  [64.0, 150.0, 46.0, 150.0], [69.2, 120.6, 41.0, 110.3], [84.1, 94.7, 70.3, 83.2],
  [107.0, 75.5, 92.0, 49.5], [135.1, 65.3, 131.9, 47.6], [164.9, 65.3, 170.1, 35.8],
  [193.0, 75.5, 202.0, 59.9], [215.9, 94.7, 238.9, 75.4], [230.8, 120.6, 247.7, 114.4]
];

const BURST_RAYS: [number, number, number, number, number][] = [
  [244.0, 200.6, 371.9, 202.2, 2.9], [242.4, 211.8, 365.5, 245.9, 3.2], [240.5, 217.1, 340.6, 259.3, 3.3],
  [234.0, 228.0, 341.3, 316.4, 1.3], [227.5, 234.3, 285.9, 307.0, 2.3], [218.8, 239.8, 251.6, 309.3, 1.5],
  [210.8, 242.7, 245.1, 378.5, 2.8], [201.6, 244.0, 206.3, 375.7, 1.3], [189.7, 242.8, 169.8, 325.3, 1.0],
  [179.4, 238.9, 136.9, 319.0, 1.5], [170.9, 233.0, 80.1, 335.7, 1.7], [164.3, 225.7, 72.1, 292.3, 2.6],
  [161.0, 220.3, 35.1, 285.8, 2.7], [156.7, 207.7, 20.2, 231.9, 1.7], [156.0, 200.6, 68.4, 201.9, 1.3],
  [156.7, 192.2, 61.2, 174.9, 2.4], [159.4, 183.0, 45.6, 135.3, 1.8], [165.1, 173.3, 59.2, 92.2, 2.2],
  [171.9, 166.1, 101.9, 81.7, 2.7], [179.1, 161.3, 110.5, 34.4, 1.1], [191.3, 156.9, 164.7, 24.4, 1.0],
  [201.3, 156.0, 204.4, 54.4, 2.4], [207.6, 156.7, 221.2, 78.6, 1.4], [221.0, 161.3, 263.7, 82.4, 2.8],
  [229.0, 166.9, 322.4, 60.0, 1.8], [234.0, 172.0, 321.0, 100.4, 2.9], [238.8, 179.3, 352.1, 118.9, 2.9],
  [243.2, 191.8, 320.4, 177.2, 3.3]
];

function Lavender() {
  return (
    <svg className="lav" viewBox="0 0 80 268" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M40 260 Q34 195 40 122" />
      <path d="M40 210 C24 200 16 186 18 172 C30 176 39 190 40 206 Z" />
      <path d="M40 190 C56 182 64 168 63 154 C51 159 42 172 40 186 Z" />
      <ellipse cx="29.0" cy="122.0" rx="6.2" ry="9.4" transform="rotate(-24 29.0 122.0)" />
      <ellipse cx="50.5" cy="114.0" rx="5.9" ry="9.0" transform="rotate(24 50.5 114.0)" />
      <ellipse cx="30.0" cy="106.0" rx="5.6" ry="8.5" transform="rotate(-24 30.0 106.0)" />
      <ellipse cx="49.5" cy="98.0" rx="5.3" ry="8.1" transform="rotate(24 49.5 98.0)" />
      <ellipse cx="31.0" cy="90.0" rx="5.1" ry="7.7" transform="rotate(-24 31.0 90.0)" />
      <ellipse cx="48.5" cy="82.0" rx="4.8" ry="7.2" transform="rotate(24 48.5 82.0)" />
      <ellipse cx="32.0" cy="74.0" rx="4.5" ry="6.8" transform="rotate(-24 32.0 74.0)" />
      <ellipse cx="47.5" cy="66.0" rx="4.2" ry="6.4" transform="rotate(24 47.5 66.0)" />
      <ellipse cx="33.0" cy="58.0" rx="3.9" ry="6.0" transform="rotate(-24 33.0 58.0)" />
      <ellipse cx="46.5" cy="50.0" rx="3.6" ry="5.5" transform="rotate(24 46.5 50.0)" />
      <ellipse cx="34.0" cy="42.0" rx="3.4" ry="5.1" transform="rotate(-24 34.0 42.0)" />
      <ellipse cx="45.5" cy="34.0" rx="3.1" ry="4.7" transform="rotate(24 45.5 34.0)" />
      <ellipse cx="35.0" cy="26.0" rx="2.8" ry="4.2" transform="rotate(-24 35.0 26.0)" />
      <ellipse cx="40" cy="20" rx="3.6" ry="6" />
    </svg>
  );
}

export function AmbianceEau() {
  return (
    <div className="amb amb--eau" aria-hidden="true">
      <span className="glow" />
      <svg className="waves" viewBox="0 0 240 110" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {WAVE_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      <div className="bubbles">
        {BUBBLES.map((bubble, index) => (
          <i
            key={index}
            style={{ '--x': bubble.x, '--s': bubble.s, '--t': bubble.t, '--d': bubble.d, '--o': bubble.o } as CSSProperties}
          />
        ))}
      </div>
      <span className="lav-wrap lav-wrap--a">
        <Lavender />
      </span>
      <span className="lav-wrap lav-wrap--b">
        <Lavender />
      </span>
      <span className="lav-wrap lav-wrap--c">
        <Lavender />
      </span>
    </div>
  );
}

// Section-wide warm wash for SunDive. The sun itself lives behind the product
// (see SunBackdrop) so it reads as one complete disc rather than a clipped corner.
export function AmbianceSoleil() {
  return (
    <div className="amb amb--soleil" aria-hidden="true">
      <span className="glow" />
      <span className="haze" />
    </div>
  );
}

// SPF protection motif behind the product tube: a sunrise (rays, no disc) with a
// protective shield at the centre. Rendered inside the product `.shot` (behind
// the image) so it stays centred on the product in every layout. The rays rotate
// slowly; the shield stays put.
export function SunBackdrop() {
  return (
    <div className="sun-backdrop" aria-hidden="true">
      <svg className="sun-full" viewBox="0 0 300 300" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <g className="sun__rays" strokeWidth="2.2">
          {SUN_RAYS.map(([x1, y1, x2, y2]) => (
            <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <path
          className="shield"
          strokeWidth="2.4"
          d="M150 78 C180 94 214 100 240 100 L240 156 C240 208 205 244 150 268 C95 244 60 208 60 156 L60 100 C86 100 120 94 150 78 Z"
        />
      </svg>
    </div>
  );
}

export function AmbianceEclat() {
  return (
    <div className="amb amb--eclat" aria-hidden="true">
      <span className="glow" />
      <span className="beam" />
      <svg className="burst" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeLinecap="round">
        <g className="burst__g">
          {BURST_RAYS.map(([x1, y1, x2, y2, w]) => (
            <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={w} />
          ))}
        </g>
      </svg>
      <div className="sparks">
        {SPARKS.map((spark, index) => (
          <svg
            key={index}
            className="spark"
            viewBox="0 0 24 24"
            style={{ '--x': spark.x, '--y': spark.y, '--s': spark.s, '--t': spark.t, '--d': spark.d, '--o': spark.o } as CSSProperties}
          >
            <path d={SPARK_PATH} fill="currentColor" />
          </svg>
        ))}
      </div>
    </div>
  );
}
