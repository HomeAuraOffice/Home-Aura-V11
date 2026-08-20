const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const oldPasteLogic = `            if (selectedCollageTile.value === 'terminal') {
              handleCollagePaste(e, intakeForm);
            } else if (selectedProofTile.value === 'terminal') {
              handleProofPaste(e, intakeForm);
            } else if (selectedProofTile.value === 'modal') {
              if (modalData.order) handleProofPaste(e, modalData.order);
              if (modalData.bill) handleProofPaste(e, modalData.bill);
            }`;

const newPasteLogic = `            if (selectedCollageTile.value === 'modal') {
              if (modalData.order) handleCollagePaste(e, modalData.order);
            } else if (selectedCollageTile.value === 'terminal') {
              handleCollagePaste(e, intakeForm);
            } else if (selectedProofTile.value === 'terminal') {
              handleProofPaste(e, intakeForm);
            } else if (selectedProofTile.value === 'modal') {
              if (modalData.order) handleProofPaste(e, modalData.order);
              if (modalData.bill) handleProofPaste(e, modalData.bill);
            }`;

appJs = appJs.replace(oldPasteLogic, newPasteLogic);
fs.writeFileSync('app.js', appJs);
console.log('Updated global paste logic');
