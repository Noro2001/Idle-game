export function formatNumber(num: number): string {
  if (num === 0) return '0';
  
  if (num < 1000) {
    return num.toFixed(1).replace(/\.0$/, '');
  }
  
  const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const exponent = Math.min(Math.floor(Math.log10(num) / 3), units.length - 1);
  const value = num / Math.pow(10, exponent * 3);
  
  return value.toFixed(2).replace(/\.00$/, '') + units[exponent];
}

export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  } else {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  }
}