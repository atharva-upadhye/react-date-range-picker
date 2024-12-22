export function printToConsole(msg: string) {
  if (msg === "0") throw new Error("0 recieved");
  let x = "asdfasdf";
  x += new Date().toISOString();
  console.log(msg, x);
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase().concat(word.slice(1));
    })
    .join(" ");
}
