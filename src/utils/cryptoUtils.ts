export function randomBytesHex(count: number): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(count);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  let hex = '';
  for (let i = 0; i < count; i++) {
    hex += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  }
  return hex;
}

export function hashStringHex(str: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x097c1dae;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 16777619);
    h2 = Math.imul(h2 ^ ch, 314159265);
  }
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const part3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const part4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  const full = (part1 + part2 + part3 + part4 + part1 + part2 + part3 + part4);
  return full.substring(0, 64);
}
