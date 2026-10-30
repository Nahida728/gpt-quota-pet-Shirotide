const test = require("node:test");
const assert = require("node:assert/strict");
const { restoreDesktopWindow, normalizeAppearance, migrateDesktopSettings } = require("../src/desktop-settings");
const { imageDimensions, decodeDataUrl, normalizeCrop } = require("../src/background-image");
const primary = { workArea: { x:0, y:0, width:1920, height:1040 } };

test("first desktop launch centers the user's fixed 1200 by 800 window", () => {
  assert.deepEqual(restoreDesktopWindow(null,[primary]),{x:360,y:120,width:1200,height:800,minWidth:1200,minHeight:800,maxWidth:1200,maxHeight:800});
});
test("small work areas lower the minimum and keep all window controls on screen", () => {
  const display={workArea:{x:0,y:0,width:960,height:600}};
  const result=restoreDesktopWindow(null,[display]);
  assert.equal(result.width,936);assert.equal(result.height,576);
  assert.equal(result.minWidth,936);assert.equal(result.minHeight,576);
  assert.ok(result.x>=0&&result.y>=0&&result.x+result.width<=960&&result.y+result.height<=600);
});
test("removed monitors and invalid saved geometry recover on the primary display",()=>{
  for(const saved of [{x:5000,y:-2000,width:1800,height:1000},{x:NaN,y:0,width:1,height:1}]){
    const result=restoreDesktopWindow(saved,[primary]);
    assert.ok(result.x>=0&&result.y>=0&&result.x+result.width<=1920&&result.y+result.height<=1040);
  }
});
test("negative-coordinate secondary monitors retain position and discard old large sizes",()=>{
  const second={workArea:{x:-1920,y:0,width:1920,height:1040}};
  const saved={x:-1700,y:50,width:1400,height:900};
  const result=restoreDesktopWindow(saved,[primary,second],primary);
  assert.equal(result.x,saved.x);assert.equal(result.y,saved.y);
  assert.equal(result.width,1200);assert.equal(result.height,800);
});
test("settings migration preserves user preferences and never promotes old small bounds",()=>{
  const data={language:"en",alwaysOnTop:true,backgroundPath:"old.png",windowBounds:{x:2,y:-600},windowCollapsed:true};
  const writes=[];const store={get:(key,fallback)=>data[key]??fallback,set:(key,value)=>{writes.push(key);data[key]=value;}};
  migrateDesktopSettings(store);const count=writes.length;migrateDesktopSettings(store);
  assert.equal(writes.length,count);assert.equal(data.backgroundPath,"old.png");assert.equal(data.alwaysOnTop,true);assert.equal(data.language,"en");
  assert.equal(data.desktopWindow,undefined);assert.deepEqual(data.desktopSettingsV1.windowBounds,{x:2,y:-600});
  assert.deepEqual(writes,["desktopSettingsV1","desktopSettingsVersion"]);
});
test("untrusted appearance values have bounded fallbacks",()=>{
  assert.equal(normalizeAppearance(null).fit,"contain");
  const appearance=normalizeAppearance({x:Infinity,y:-200,zoom:999,cardOpacity:0,blur:90,fit:"url(file)",reducedTransparency:"yes"});
  assert.equal(appearance.x,50);assert.equal(appearance.y,0);assert.equal(appearance.zoom,200);assert.equal(appearance.blur,24);assert.equal(appearance.cardOpacity,60);assert.equal(appearance.reducedTransparency,false);
});
function png(width,height){const b=Buffer.alloc(24);Buffer.from([137,80,78,71,13,10,26,10]).copy(b);b.write("IHDR",12);b.writeUInt32BE(width,16);b.writeUInt32BE(height,20);return b;}
test("encoded image dimensions reject decompression bombs before native decoding",()=>{
  assert.deepEqual(imageDimensions(png(320,240)),{width:320,height:240});
  assert.equal(imageDimensions(png(16000,16000)),null);assert.equal(imageDimensions(png(0,1)),null);assert.equal(imageDimensions(png(17000,2)),null);
  const jpeg=Buffer.from([255,216,255,255,255,255,255,255,255,255,255,255]);
  assert.doesNotThrow(()=>imageDimensions(jpeg));assert.equal(imageDimensions(jpeg),null);
});
test("WebP dimensions and background IPC reject unsupported payloads",()=>{
  const webp=Buffer.alloc(30);webp.write("RIFF",0);webp.write("WEBP",8);webp.write("VP8X",12);webp.writeUIntLE(639,24,3);webp.writeUIntLE(479,27,3);
  assert.deepEqual(imageDimensions(webp),{width:640,height:480});
  assert.equal(decodeDataUrl("data:image/svg+xml;base64,PHN2Zz4="),null);assert.equal(decodeDataUrl("data:image/png;base64,Zm9v"),null);
});
test("composition coordinates cannot crop outside the retained source",()=>{
  assert.deepEqual(normalizeCrop({x:.1,y:.2,width:.8,height:.7}),{x:.1,y:.2,width:.8,height:.7});
  for(const crop of [{x:0,y:0,width:Infinity,height:1},{x:-.1,y:0,width:1,height:1},{x:.9,y:0,width:.2,height:1},{x:0,y:0,width:0,height:1}])assert.equal(normalizeCrop(crop),null);
});
