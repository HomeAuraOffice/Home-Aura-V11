const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const dropFunc = `
        const handleCollageDrop = (event, targetObj = intakeForm) => {
          event.preventDefault();
          if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
            processCollageFile(event.dataTransfer.files[0], targetObj);
          }
        };
`;

appJs = appJs.replace(
  "        const processProofFile = async",
  dropFunc + "\\n        const processProofFile = async"
);

appJs = appJs.replace(
  "handleCollagePaste,",
  "handleCollagePaste,\\n          handleCollageDrop,"
);

fs.writeFileSync('app.js', appJs);
console.log('Added handleCollageDrop');
