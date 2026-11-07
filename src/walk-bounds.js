// Keep the legacy rooms unchanged; only the connector has a solid central wall.
// Bounds include a .3-unit visitor clearance from the wall and end wall.
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export function constrainWalk(scene,position,dx,dz) {
  const next={x:clamp(position.x+dx,-5.9,5.9),z:clamp(position.z+dz,-11.3,11.5)};
  if(scene!=='long-way')return next;
  const blocked=(x,z)=>Math.abs(x)<1.3&&z< -1.7;
  // Axis separation lets visitors slide along the spine, never through it.
  if(blocked(next.x,position.z))next.x=position.x;
  if(blocked(next.x,next.z))next.z=position.z;
  return next;
}
