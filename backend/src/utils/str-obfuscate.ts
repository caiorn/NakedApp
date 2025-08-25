// Caracteres seguros para cookies (ASCII imprimível, sem ; , espaço)
const COOKIE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&'()*+-./:<=>?@[]^_`{|}~";
const CHAR_LEN = COOKIE_CHARS.length;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function chooseK(n: number): number {
  let k = 2;
  while (gcd(k, n) !== 1) k++;
  return k;
}

export function scramble(str: string, shiftPos: number = 7, shiftChar: number = 5): string {
  const n = str.length;
  if (n <= 6) return str;

  const k = chooseK(n);
  const arr = str.split('');
  const result = new Array(n);

  for (let i = 0; i < n; i++) {
    const idx = COOKIE_CHARS.indexOf(arr[i]);
    const newChar = idx === -1 ? arr[i] : COOKIE_CHARS[(idx + shiftChar) % CHAR_LEN];
    result[(i * k + shiftPos) % n] = newChar;
  }

  return result.join('');
}

export function unscramble(str: string, shiftPos: number = 7, shiftChar: number = 5): string {
  const n = str.length;
  if (n <= 6) return str;

  const k = chooseK(n);
  const arr = str.split('');
  const result = new Array(n);

  let kInv = 0;
  for (let i = 1; i < n; i++) {
    if ((i * k) % n === 1) {
      kInv = i;
      break;
    }
  }

  for (let j = 0; j < n; j++) {
    const idx = COOKIE_CHARS.indexOf(arr[j]);
    const origChar = idx === -1 ? arr[j] : COOKIE_CHARS[(idx - shiftChar + CHAR_LEN) % CHAR_LEN];
    result[((j - shiftPos + n) * kInv) % n] = origChar;
  }

  return result.join('');
}