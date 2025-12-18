import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levelsPath = path.join(__dirname, '../src/levels.js');

function readLevels() {
    return fs.readFileSync(levelsPath, 'utf8');
}

function parseLevelLocations(content) {
    const startMarker = 'export const levels = [';
    const arrayStart = content.indexOf(startMarker);
    if (arrayStart === -1) return [];

    let currentIndex = arrayStart + startMarker.length;
    let depth = 0;
    let inString = false;
    let stringChar = '';
    let levelStart = -1;
    let levels = [];

    for (let i = currentIndex; i < content.length; i++) {
        const char = content[i];

        if (inString) {
            if (char === stringChar && content[i - 1] !== '\\') {
                inString = false;
            }
            continue;
        }

        if (char === '"' || char === '\'' || char === '`') {
            inString = true;
            stringChar = char;
            continue;
        }

        if (char === '{') {
            if (depth === 0) {
                levelStart = i;
            }
            depth++;
        } else if (char === '}') {
            depth--;
            if (depth === 0 && levelStart !== -1) {
                let end = i + 1;
                while (end < content.length && (content[end] === ' ' || content[end] === '\n' || content[end] === '\r' || content[end] === '\t')) {
                    end++;
                }
                if (content[end] === ',') {
                    end++;
                }

                levels.push({
                    start: levelStart,
                    end: end,
                    content: content.substring(levelStart, end)
                });
                levelStart = -1;
            }
        } else if (char === ']' && depth === 0) {
            break;
        }
    }
    return levels;
}

function moveLevel(fromIndex, toIndex) {
    let content = readLevels();
    let locations = parseLevelLocations(content);

    if (fromIndex < 0 || fromIndex >= locations.length) {
        console.error(`From Index ${fromIndex} out of bounds.`);
        return;
    }

    // We want to move level at fromIndex to toIndex.

    // 1. Extract the content of the level to move.
    // Note: The content includes the trailing comma if present.
    // We might need to clean it up.

    const levelToMove = locations[fromIndex];
    let levelStr = levelToMove.content;

    // Ensure it has a comma if it's going to be middle, or handling last element logic?
    // The parser consumes trailing comma into `content`.
    // If we move the last element (which might NOT have a comma) to the middle, we need to add a comma.
    if (!levelStr.trim().endsWith(',')) {
        levelStr += ',';
    }

    // 2. Remove it from the file string.
    // We reconstruct the file without it.

    let parts = [];
    let lastEnd = 0;

    // Actually, reconstructing is easier if we just have the array of strings and rebuild the array body.
    const levelStrings = locations.map(l => {
        let s = l.content.trim();
        if (s.endsWith(',')) s = s.substring(0, s.length - 1); // remove comma for clean list
        return s;
    });

    // Remove element
    const movingLevelContent = levelStrings.splice(fromIndex, 1)[0];

    // Insert at new index
    if (toIndex > levelStrings.length) {
        toIndex = levelStrings.length; // Append if out of bounds
    }
    levelStrings.splice(toIndex, 0, movingLevelContent);

    // Rebuild the file content
    // We need to preserve imports and the array shell.
    const startMarker = 'export const levels = [';
    const startIdx = content.indexOf(startMarker) + startMarker.length;

    // Find end of array `];`
    // We can assume the locations parser found the end.
    // But let's just find the last `]` after the last level found.
    // Or just replace the range from first level start to last level end?

    if (locations.length === 0) {
        // Empty array, just insert?
        console.error("No levels found to move.");
        return;
    }

    const insertionStart = locations[0].start;
    // We need to find where the array ends.
    // The loop in parser stopped at `]`.
    // Let's re-run parser or assume logic holds.

    // Better: We have `start` of first and `end` of last.
    // But there might be comments or whitespace between them?
    // Our parser captured `content` including trailing whitespace/comma.
    // It didn't capture content BETWEEN levels (comments).
    // If we rebuild from `levelStrings`, we LOSE comments between levels.
    // This is a trade-off. 
    // The user didn't mention comments.
    // To preserve comments, we'd need a full AST or token list.
    // For now, let's assume minimizing risk: rebuild the array content.

    const newArrayBody = levelStrings.map(s => `    ${s}`).join(',\n');

    // We need to replace the original body.
    // Find `export const levels = [`
    // Find the matching `];`

    const openBracket = content.indexOf('[');
    const closeBracket = content.lastIndexOf(']'); // Fragile if there are other arrays
    // But `levels.js` structure is known.

    const pre = content.substring(0, openBracket + 1);
    const post = content.substring(closeBracket);

    let newContent = pre + '\n' + newArrayBody + '\n' + post;

    // Renumber
    let currentId = 1;
    newContent = newContent.replace(/id:\s*\d+,/g, () => `id: ${currentId++},`);

    currentId = 1;
    newContent = newContent.replace(/name:\s*"Level\s*\d+",/g, () => `name: "Level ${currentId++}",`);

    fs.writeFileSync(levelsPath, newContent);
    console.log(`Moved level from ${fromIndex} to ${toIndex}.`);
}

const fromIdx = parseInt(process.argv[2]);
const toIdx = parseInt(process.argv[3]);

if (!isNaN(fromIdx) && !isNaN(toIdx)) {
    moveLevel(fromIdx, toIdx);
} else {
    console.log("Usage: node tools/moveLevel.js <fromIndex> <toIndex>");
}
