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
                // Found a level object
                // Look ahead for comma
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
            break; // End of levels array
        }
    }
    return levels;
}

function deleteLevel(index) {
    let content = readLevels();
    const locations = parseLevelLocations(content);

    if (index < 0 || index >= locations.length) {
        console.error(`Index ${index} out of bounds. Found ${locations.length} levels.`);
        return;
    }

    const levelToRemove = locations[index];
    console.log(`Deleting level at index ${index}...`);

    // Remove the content
    // We need to be careful about newlines/formatting.
    // The previous implementation replaced with regex which was clean but fragile.
    // Here we slice.

    // Check if we need to remove a preceding comma or newline if it was separate?
    // Our parser includes trailing comma in `end`.

    // We construct new content.
    const before = content.substring(0, levelToRemove.start).trimEnd();
    // trimEnd on before to remove whitespace before the deleted object if we want.
    // But `levelToRemove.start` points to `{`.
    // Usually there's indentation before it.

    // Let's refine the slice.
    // We want to keep the array formatting.
    // If we simply remove [start, end), we might leave a blank line.

    let newContent = content.substring(0, levelToRemove.start) + content.substring(levelToRemove.end);

    // Now renumber IDs.
    // We will parse again or just regex replace IDs.
    // Since we are renumbering EVERYTHING, regex global replace is fine and easiest.

    let currentId = 1;
    newContent = newContent.replace(/id:\s*\d+,/g, () => `id: ${currentId++},`);

    currentId = 1;
    newContent = newContent.replace(/name:\s*"Level\s*\d+",/g, () => `name: "Level ${currentId++}",`);

    fs.writeFileSync(levelsPath, newContent);
    console.log(`Level at index ${index} deleted. Levels renumbered.`);
}

const idx = parseInt(process.argv[2]);
if (!isNaN(idx)) {
    deleteLevel(idx);
} else {
    console.log("Usage: node tools/deleteLevel.js <index>");
}
