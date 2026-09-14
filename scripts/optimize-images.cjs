// Optional local asset preparation (requires sharp). Vercel serves the committed
// results; it never encodes images or installs image-processing dependencies.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'assets/optimized');
const specs={
 hero:{source:'hero/reef-survey.webp',widths:[960,1280,1672],sizes:'(max-width:760px) max(100vw, 1400px), max(calc(100vw - 146px), 178vh)'},
 resort:{source:'services/resort-800.webp',widths:[320,480,800]},
 boat:{source:'services/boat-800.webp',widths:[320,480,800]},
 wreck:{source:'services/wreck-800.webp',widths:[320,480,800]},
 miguel:{source:'team/miguel-profile.webp',widths:[160,320,640]},
 cristina:{source:'team/cristina-profile.webp',widths:[160,320,640]},
 aida:{source:'team/aida-20260914.jpg',widths:[160,320,640,1196]},
 andreu:{source:'team/andreu-20260914.jpg',widths:[160,320,640,1199]},
 'map-relief':{source:'technology/map-relief.jpg',widths:[480,800],map:true},
 'map-satellite':{source:'technology/map-satellite.jpg',widths:[480,800],map:true},
 'map-perspective':{source:'technology/map-perspective.jpg',widths:[480,800],map:true},
 camera:{source:'technology/camera-tripod-20260914-960.webp',widths:[480,640,960]},
 sonar:{source:'technology/sonar-960.webp',widths:[480,640,960]},
 scooter:{source:'technology/scooter-960.webp',widths:[480,640,960]}
};
// Local 8x8 luminance SSIM, comparing each encoded candidate at its exact
// delivery resolution. This is a guardrail, not a substitute for visual QA.
function similarity(a,b,width,height){
 let total=0,blocks=0;const c1=6.5025,c2=58.5225;
 for(let y=0;y<height;y+=8)for(let x=0;x<width;x+=8){
  let sa=0,sb=0,saa=0,sbb=0,sab=0,n=0;
  for(let yy=y;yy<Math.min(y+8,height);yy++)for(let xx=x;xx<Math.min(x+8,width);xx++){
   const k=(yy*width+xx)*3,aa=.2126*a[k]+.7152*a[k+1]+.0722*a[k+2],bb=.2126*b[k]+.7152*b[k+1]+.0722*b[k+2];
   sa+=aa;sb+=bb;saa+=aa*aa;sbb+=bb*bb;sab+=aa*bb;n++;
  }
  const ma=sa/n,mb=sb/n,va=Math.max(0,saa/n-ma*ma),vb=Math.max(0,sbb/n-mb*mb),cov=sab/n-ma*mb;
  total+=((2*ma*mb+c1)*(2*cov+c2))/((ma*ma+mb*mb+c1)*(va+vb+c2));blocks++;
 }
 return total/blocks;
}
function save(id,width,ext,buffer){
 const digest=crypto.createHash('sha256').update(buffer).digest('hex').slice(0,12);
 const relative=`assets/optimized/${id}-${width}-${digest}.${ext}`;
 fs.writeFileSync(path.join(root,relative),buffer);return {file:relative,bytes:buffer.length};
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});const manifest={},report=[];
 for(const [id,spec] of Object.entries(specs)){
  const source=path.join(root,'assets',spec.source),meta=await sharp(source).metadata();
  const variants=[];
  for(const width of spec.widths){
   const baseline=await sharp(source).resize({width,withoutEnlargement:true}).removeAlpha().toColourspace('srgb').raw().toBuffer({resolveWithObject:true});
   const raw={width:baseline.info.width,height:baseline.info.height,channels:3};
   let avif,score=0,quality=spec.map?74:68;
   for(;quality<=92;quality+=4){
    avif=await sharp(baseline.data,{raw}).avif({quality,effort:5,chromaSubsampling:'4:4:4'}).toBuffer();
    const decoded=await sharp(avif).removeAlpha().toColourspace('srgb').raw().toBuffer();
    score=similarity(baseline.data,decoded,raw.width,raw.height);
    if(score>=(spec.map?.992:.985))break;
   }
   if(score<(spec.map?.992:.985))throw Error(`Fidelity check failed for ${id} at ${width}px; do not publish this candidate`);
   let fallback=await sharp(baseline.data,{raw}).webp({quality:spec.map?94:90,effort:6}).toBuffer(),ext='webp';
   // Never replace an already smaller existing fallback with a larger or
   // needlessly recompressed file at the same resolution.
   const sibling=source.replace(/-(800|960)\.webp$/,`-${width}.webp`);
   const existing=width===meta.width?source:sibling!==source&&fs.existsSync(sibling)?sibling:null;
   if(existing){const bytes=fs.readFileSync(existing);if(bytes.length<=fallback.length){fallback=bytes;ext=path.extname(existing).slice(1).replace('jpeg','jpg');}}
   variants.push({width:raw.width,height:raw.height,avif:save(id,width,'avif',avif),fallback:save(id,width,ext,fallback),ssim:Number(score.toFixed(6)),quality:Math.min(quality,92)});
  }
  const sizes=spec.sizes||(spec.source.startsWith('team/')?'(max-width:760px) 140px, (max-width:1199px) 40vw, 24vw':spec.source.startsWith('services/')?'(max-width:760px) calc(88vw - 44px), (max-width:1023px) 40vw, 28vw':'(max-width:760px) 88vw, (min-width:1024px) and (min-height:640px) min(54vw, calc((100dvh - 300px)*1.6)), 54vw');
  manifest[id]={width:meta.width,height:meta.height,sizes,variants};
  const largest=variants.at(-1);report.push({id,source:spec.source,before:fs.statSync(source).size,afterAvif:largest.avif.bytes,afterFallback:largest.fallback.bytes,ssim:largest.ssim});
  console.log(id,JSON.stringify(report.at(-1)));
 }
 fs.writeFileSync(path.join(__dirname,'image-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 const reportDir=path.resolve(root,'../output/image-optimization');fs.mkdirSync(reportDir,{recursive:true});
 fs.writeFileSync(path.join(reportDir,'measurements.json'),JSON.stringify({photos:report,before:report.reduce((n,r)=>n+r.before,0),afterAvif:report.reduce((n,r)=>n+r.afterAvif,0)},null,2)+'\n');
 console.log('Prepared',Object.keys(manifest).length,'photos; original files preserved.');
})().catch(error=>{console.error(error);process.exitCode=1;});
