/* Detect input capabilities rather than guessing the device from its name. */
(function(root){
  const usesTouchControls=({coarsePointer,touchPoints,hoverNone})=>!!coarsePointer||(touchPoints>0&&!!hoverNone);
  root.MollyControls={usesTouchControls};
  if(typeof module!=='undefined')module.exports=root.MollyControls;
})(typeof window!=='undefined'?window:globalThis);
