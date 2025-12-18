import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levelsPath = path.join(__dirname, '../src/levels.js');

// Helper to read levels
function readLevels() {
    return fs.readFileSync(levelsPath, 'utf8');
}

function insertLevel(index) {
    let content = readLevels();

    // Find the start of the array
    const startMarker = 'export const levels = [';
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) {
        console.error("Could not find levels array");
        return;
    }

    const targetId = index + 1;
    // Look for "id: <targetId>,"
    const targetRegex = new RegExp(`^\\s*\\{\\s*\\n\\s*id:\\s*${targetId},`, 'm');

    const loc = content.search(targetRegex);

    if (loc === -1 && index > 0) {
        console.log("Target index not found. If you want to append, just add to the end manually.");
    } else if (loc !== -1) {
        console.log(`Inserting level at index ${index} (ID ${targetId})...`);

        // Construct new level string
        const newLevelStr = `    {
        id: ${targetId},
        name: "Level ${targetId}",
        grid: { width: 5, height: 5 },
        items: [],
        emitters: [],
        inventory: { mirror1: 0, mirror2: 0 }
    },\n`;

        const before = content.substring(0, loc);
        const after = content.substring(loc);

        let newContent = before + newLevelStr + after;

        // Renumber ALL levels sequentially.
        let currentId = 1;
        newContent = newContent.replace(/id:\s*\d+,/g, () => {
            return `id: ${currentId++},`;
        });

        // Also update names "Level X"
        currentId = 1;
        newContent = newContent.replace(/name:\s*"Level\s*\d+",/g, () => {
            return `name: "Level ${currentId++}",`;
        });

        fs.writeFileSync(levelsPath, newContent);
        console.log("Level inserted and IDs updated.");
    }
}

// Usage: node tools/addLevel.js <index>
const idx = parseInt(process.argv[2]);
if (!isNaN(idx)) {
    insertLevel(idx);
} else {
    console.log("Please provide an index. Usage: node tools/addLevel.js <index>");
}
