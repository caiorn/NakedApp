export function scramble(str) {
  if (!str) return str;
  
  const arr = str.split('');
  const result = new Array(arr.length);
  
  for (let i = 0; i < arr.length; i++) {
    const newPos = (i * 3 + 7) % arr.length;
    result[newPos] = arr[i];
  }
  
  return result.join('');
}

export function unscramble(str) {
  if (!str) return str;
  
  const arr = str.split('');
  const result = new Array(arr.length);
  
  for (let i = 0; i < arr.length; i++) {
    const newPos = (i * 3 + 7) % arr.length;
    result[i] = arr[newPos];
  }
  
  return result.join('');
}