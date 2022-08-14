import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

export async function getJSON(url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json(); // Parse JSON
    if (!res.ok) throw new Error(`${data.message}`); // Bad response: 4XX
    return data;
  } catch (err) {
    throw err;
  }
}

export function timeout(s) {
  return new Promise(function executor(_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
}
