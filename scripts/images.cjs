const manifest=require('./image-manifest.json');
const publicImages=Object.fromEntries(Object.entries(manifest).map(([id,image])=>[id,{
 src:'/'+image.variants.at(-1).fallback.file,
 srcset:image.variants.map(v=>`/${v.fallback.file} ${v.width}w`).join(', '),
 avif:image.variants.map(v=>`/${v.avif.file} ${v.width}w`).join(', '),
 sizes:image.sizes,width:image.width,height:image.height
}]));
function renderImages(html){
 return html.replace(/<img\b[^>]*data-photo="([^"]+)"[^>]*>/g,(tag,id)=>{
  const image=publicImages[id];if(!image)throw Error('Unknown photograph: '+id);
  const remaining=tag.replace(/^<img|>$/g,'').replace(/\s(?:data-photo|src|srcset|sizes|width|height|decoding|fetchpriority)="[^"]*"/g,'');
  const sourceId=tag.includes('id="equipment-image"')?' id="equipment-avif"':'';
  return `<picture class="responsive-photo" data-photo="${id}"><source${sourceId} type="image/avif" srcset="${image.avif}" sizes="${image.sizes}"><img${remaining} src="${image.src}" srcset="${image.srcset}" sizes="${image.sizes}" width="${image.width}" height="${image.height}" decoding="async"${id==='hero'?' fetchpriority="high"':''}></picture>`;
 });
}
module.exports={manifest,publicImages,renderImages};
