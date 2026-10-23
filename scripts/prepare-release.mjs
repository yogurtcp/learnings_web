import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dist=new URL('../dist/',import.meta.url);
const entries=(await readdir(dist)).filter(name=>name!=='release.json').sort();
const digest=createHash('sha256');
for(const name of entries){let bytes=await readFile(new URL(name,dist));if(name==='sw.js')bytes=Buffer.from(bytes.toString().replace(/const CACHE='[^']+';/,"const CACHE='learnings-web-RELEASE';"));digest.update(name+'\0');digest.update(bytes);}
const version=digest.digest('hex').slice(0,20);
const path=new URL('sw.js',dist),old=await readFile(path,'utf8');
const next=old.replace(/const CACHE='[^']+';/,`const CACHE='learnings-web-${version}';`);
if(next!==old)await writeFile(path,next);
const release=JSON.stringify({version},null,2)+'\n';let prior='';try{prior=await readFile(new URL('release.json',dist),'utf8');}catch{}
if(prior!==release)await writeFile(new URL('release.json',dist),release);
console.log(`Prepared learnings_web release ${version}`);
