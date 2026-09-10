// extract_stages.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const gameJsPath = path.resolve(__dirname, '../game.js');
let code = fs.readFileSync(gameJsPath, 'utf8').replace(/\r\n/g, '\n');

const startIndex = code.indexOf('const GAME_STAGES =');
if (startIndex === -1) {
    console.error('GAME_STAGES not found in game.js');
    process.exit(1);
}

const delimiter = '// 게임 런타임 제어';
const endIndex = code.indexOf(delimiter);

let stagesCode = code.substring(startIndex, endIndex !== -1 ? endIndex : code.length);
stagesCode = stagesCode.replace('const GAME_STAGES =', 'this.GAME_STAGES =');

try {
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(stagesCode, sandbox);
    const stages = sandbox.GAME_STAGES;
    const stageCount = Object.keys(stages).length;
    console.log(`Successfully extracted ${stageCount} stages from game.js!`);
    
    // JSON 저장
    const outputPath = path.resolve(__dirname, '../data/stages.json');
    fs.writeFileSync(outputPath, JSON.stringify(stages, null, 2), 'utf8');
    console.log(`Saved stages to ${outputPath}`);
} catch (err) {
    console.error('Error extracting GAME_STAGES:', err);
    process.exit(1);
}
