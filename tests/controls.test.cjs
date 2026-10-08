const {test}=require('node:test');const assert=require('node:assert/strict');const {usesTouchControls}=require('../control-mode.js');
test('Surfplatta med pekskärm använder pekstyrning, även med ansluten mus',()=>{assert(usesTouchControls({coarsePointer:true,touchPoints:5,hoverNone:false}));});
test('Touchpunkter och ingen hover täcker surfplattans reservdetektering',()=>{assert(usesTouchControls({coarsePointer:false,touchPoints:5,hoverNone:true}));});
test('Vanlig dator och enbart smalt fönster växlar inte till pekstyrning',()=>{assert.equal(usesTouchControls({coarsePointer:false,touchPoints:0,hoverNone:false}),false);assert.equal(usesTouchControls({coarsePointer:false,touchPoints:0,hoverNone:true}),false);});
