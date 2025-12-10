const fs = require('fs');
const path = require('path');

const levelsPath = path.join(__dirname, '../src/levels.js');

// Helper to read levels
function readLevels() {
    const content = fs.readFileSync(levelsPath, 'utf8');
    // Extract the array part. This is a bit hacky but avoids eval if possible.
    // However, since levels.js imports CELL_TYPES, we can't just require it easily without babel.
    // So we'll do string manipulation.
    return content;
}

function insertLevel(index, newLevelObj) {
    let content = readLevels();

    // Find the start of the array
    const startMarker = 'export const levels = [';
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) {
        console.error("Could not find levels array");
        return;
    }

    // We need to parse the file content to find where to insert.
    // This is complex with regex.
    // Alternative: We can just append it and let the user reorder? No, user wants insertion.

    // Let's try a simpler approach: Read the file, find the object at index.
    // Since the file is formatted, we can look for "id: X".

    // 1. Read file
    // 2. Split by "id: " to find blocks?

    // Actually, let's just ask the user to paste the new level code in the right place?
    // No, the user asked for a tool.

    // Let's use a regex to find all level objects.
    // Assuming standard formatting: "    {" starts a level.

    // Better approach:
    // 1. Match all `{ id: \d+,` blocks.
    // 2. Identify the position of the Nth block.
    // 3. Insert the new string there.
    // 4. Renumber all subsequent IDs.

    // Let's assume the user provides the new level code as a string in a file or argument.
    // For this script, I'll define a template and insert it.

    console.log(`Inserting level at index ${index}...`);

    // Regex to find level starts
    const levelStartRegex = /^\s*\{\s*$/gm;
    let match;
    let count = 0;
    let insertPos = -1;

    // We need to find the insertion point.
    // If index is 15 (0-based), we need to find the 15th occurrence of "    {" inside the array.
    // The array starts after "export const levels = [".

    const arrayStart = content.indexOf('[');
    const arrayContent = content.substring(arrayStart);

    // Find the Nth opening brace
    let braceCount = 0;
    let currentPos = arrayStart;

    // Simple parser
    for (let i = arrayStart; i < content.length; i++) {
        if (content[i] === '{') {
            // Check if it's a level object start (depth 1 inside array)
            // We can track depth.
            // But simply counting "    {" might be enough if formatted.
        }
    }

    // Let's do a string split approach which is safer for this specific file structure.
    const parts = content.split(/^\s*\{\s*id:\s*\d+,/gm);

    // This removes the "    { id: 1," part. Not good.

    // Let's use a placeholder approach.
    // We will look for "id: <index+1>,".
    // If we want to insert at 15 (making it the new 16th level, ID 16),
    // we look for "id: 16," and insert BEFORE the preceding "{"

    const targetId = index + 1;
    const targetRegex = new RegExp(`^\\s*\\{\\s*\\n\\s*id:\\s*${targetId},`, 'm');

    const loc = content.search(targetRegex);

    if (loc === -1 && index > 0) {
        // Maybe appending?
        console.log("Target index not found, maybe appending?");
        // Append before the last "];"
        const end = content.lastIndexOf('];');
        // Insert logic here
    } else if (loc !== -1) {
        // Found the level that is currently at the target index.
        // We need to insert BEFORE it.
        // The regex matched "    {\n        id: 16,"
        // So we insert before `loc`.

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

        // Now renumber IDs
        // We need to increment IDs starting from targetId + 1 (which was the old targetId)
        // actually, we inserted a new ID: targetId.
        // The old ID: targetId needs to become targetId + 1.
        // And so on.

        // We can run a replace loop.
        // Find "id: X," where X >= targetId.
        // But we must do it in reverse order to avoid double incrementing!
        // Or we can just rebuild the IDs.

        newContent = newContent.replace(/id:\s*(\d+),/g, (match, id) => {
            const num = parseInt(id);
            if (num >= targetId) {
                // Wait, the new level we inserted has ID = targetId.
                // The OLD level that was there also has ID = targetId.
                // We want the OLD level (and subsequent) to increment.
                // But our replace will hit the new level too.
                // So we should have inserted the new level with a placeholder ID?
                // Or just renumber EVERYTHING based on order.
                return `id: ${num},`; // Placeholder
            }
            return match;
        });

        // Better strategy: Renumber ALL levels sequentially.
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
// Example: node tools/addLevel.js 15 (Inserts at index 15, becoming Level 16)
const idx = parseInt(process.argv[2]);
if (!isNaN(idx)) {
    insertLevel(idx);
} else {
    console.log("Please provide an index.");
}
