// screenshots.mjs
// Takes a 1280x720 screenshot of each live project, using Chrome in "headless"
// mode (that means Chrome runs with no window, just doing the job).
//
// How to run it, from the project folder (the one with index.html):
//     node tools/screenshots.mjs
//
// Needs Google Chrome installed and an internet connection.
// No npm install needed: it only uses tools that come with Node.

import { execFile } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { promisify } from "node:util";

// execFile starts another program. promisify lets us use it with "await",
// which means "wait here until it has finished".
const run = promisify(execFile);

// Places Chrome usually lives on Windows. The first one that exists is used.
const CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
];
const chrome = CHROME_PATHS.find((path) => existsSync(path));

if (!chrome) {
  console.error("Chrome not found. Add its path to CHROME_PATHS at the top of this file.");
  process.exit(1);
}

// One line per screenshot: the file name to save, and the page to capture.
// To add a project, copy a line and change both values.
const SHOTS = [
  { file: "anyfile.png", url: "https://any-file-opener-ten.vercel.app/" },
  { file: "anatomy.png", url: "https://absolutee-anatomyy.vercel.app/" },
  { file: "gallery.png", url: "https://excels-gallery.vercel.app/gallery" },
];

mkdirSync("images/shots", { recursive: true });

for (const shot of SHOTS) {
  console.log("Taking", shot.file, "...");
  try {
    await run(chrome, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--window-size=1280,720",
      "--virtual-time-budget=10000", // let the page run for about 10 seconds so it finishes loading
      `--screenshot=${resolve("images/shots", shot.file)}`,
      shot.url,
    ]);
    console.log("  saved images/shots/" + shot.file);
  } catch (error) {
    console.log("  failed:", error.message);
  }
}

console.log("Done. Refresh the site to see the screenshots.");
