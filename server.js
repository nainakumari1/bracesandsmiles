'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),zlib=require('zlib');
const {pages,SITE}=require('./pages');
const PUB=path.join(__dirname,'public'),PORT=process.env.PORT||3000;
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.ico':'image/x-icon','.txt':'text/plain','.xml':'application/xml','.webmanifest':'application/manifest+json'};
const cache=new Map();
const sec={'X-Content-Type-Options':'nosniff','X-Frame-Options':'SAMEORIGIN','Referrer-Policy':'strict-origin-when-cross-origin'};
function send(req,res,code,type,body,cc){
  const h={...sec,'Content-Type':type,'Cache-Control':cc,'Vary':'Accept-Encoding'};
  if(/html|css|javascript|svg|xml|text/.test(type)&&/\bgzip\b/.test(req.headers['accept-encoding']||'')){
    const k=type+body.length+(body.slice?body.slice(0,40):'');
    let z=cache.get(k);if(!z){z=zlib.gzipSync(body);cache.set(k,z)}
    h['Content-Encoding']='gzip';body=z;
  }
  h['Content-Length']=Buffer.byteLength(body);res.writeHead(code,h);req.method==='HEAD'?res.end():res.end(body);
}
http.createServer((req,res)=>{
  let p;try{p=decodeURIComponent(new URL(req.url,'http://x').pathname)}catch{p='/'}
  if(p.length>1&&p.endsWith('/'))p=p.slice(0,-1);
  if(p==='/robots.txt')return send(req,res,200,MIME['.txt'],`User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`,'public, max-age=3600');
  if(p==='/sitemap.xml'){const u=Object.keys(pages).map(k=>`<url><loc>${SITE.url}${k==='/'?'':k}</loc></url>`).join('');return send(req,res,200,MIME['.xml'],`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${u}</urlset>`,'public, max-age=3600')}
  if(pages[p])return send(req,res,200,MIME['.html'],pages[p],'public, max-age=300');
  const f=path.normalize(path.join(PUB,p));
  if(f.startsWith(PUB)&&fs.existsSync(f)&&fs.statSync(f).isFile()){
    const ext=path.extname(f).toLowerCase();
    return send(req,res,200,MIME[ext]||'application/octet-stream',fs.readFileSync(f),'public, max-age=2592000');
  }
  send(req,res,404,MIME['.html'],pages['/404'],'no-cache');
}).listen(PORT,()=>console.log('Braces & Smiles running on port '+PORT));
