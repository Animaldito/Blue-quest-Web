// Recovery markers reuse existing Git objects. No copies, AI, network or deletions.
const {execFileSync}=require('node:child_process');
const {existsSync,realpathSync}=require('node:fs');
const path=require('node:path');
const root=realpathSync(path.resolve(__dirname,'..'));
const windowsGit='C:/Program Files/Git/cmd/git.exe';
const git=process.platform==='win32'&&existsSync(windowsGit)?windowsGit:'git';
const run=(...args)=>execFileSync(git,['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
try{
 const canonical=value=>process.platform==='win32'?value.toLowerCase():value;
 if(canonical(realpathSync(run('rev-parse','--show-toplevel')))!==canonical(root))throw Error('Use the website repository, not a parent repository.');
 if(process.argv[2]==='--list'){
  console.log(run('for-each-ref','--sort=-creatordate','--format=%(refname:short) | %(creatordate:iso8601) | %(subject)','refs/tags/checkpoint/'));
 }else{
  const name=process.argv[2]||'antes-de-cambios';
  if(process.argv.length>3||!/^[a-z0-9][a-z0-9-]{0,70}$/.test(name))throw Error('Use a short name with lowercase letters, numbers and hyphens.');
  if(run('status','--porcelain'))throw Error('Uncommitted or untracked files exist. Save/review them first; a checkpoint does not protect unsaved files.');
  const stamp=new Date().toISOString().replace(/[-:]/g,'').replace('T','-').replace(/[.Z]/g,'');
  const tag='checkpoint/'+stamp+'-'+name;
  run('tag','-a',tag,'-m','Recovery point: '+name,'HEAD');
  console.log('Saved: '+tag);
  console.log('Local marker. Synchronize with the next authorized git push --follow-tags origin main.');
 }
}catch(error){console.error(error.stderr?.toString().trim()||error.message);process.exitCode=1;}
