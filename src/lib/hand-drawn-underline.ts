// A stable seed gives each label its own marker stroke, including after navigation.
export function underlineStyle(key: string) {
  let seed = 2166136261;
  for (const character of key) seed = Math.imul(seed ^ character.codePointAt(0)!, 16777619) >>> 0;
  function variation() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const y = (center: number) => (center + (variation() - .5) * 2).toFixed(1);
  const path = `M1 ${y(9)} L4 ${y(5)} C28 ${y(3)} 49 ${y(6)} 79 ${y(4)} S132 ${y(3)} 156 ${y(4)} L159 ${y(6)} L156 ${y(9)} C128 ${y(8)} 108 ${y(10)} 80 ${y(9)} S28 ${y(11)} 4 ${y(10)} Z`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 14" preserveAspectRatio="none"><path d="${path}"/></svg>`;
  return `--hand-underline: url("data:image/svg+xml,${encodeURIComponent(svg)}"); --hand-underline-angle: ${(variation() * 1.6 - .8).toFixed(2)}deg`;
}
