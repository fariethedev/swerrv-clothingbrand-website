const fs = require('fs');
const file = 'c:/Users/User/Desktop/swervbackend/swerrv/src/main/java/com/swerrv/swerrv/config/DataInitializer.java';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/^.*swerrv_.*\.png.*$\n?/gm, '');
fs.writeFileSync(file, content);
