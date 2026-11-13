import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const unit=process.argv.includes('--unit');
const desktop='upstream/desktop/test/',plugin='upstream/plugins/dsh-asl-workspace/test/';
// The abandoned Electron subprocess check belongs to the standalone desktop host.
const files=readdirSync(desktop).filter(f=>(f.startsWith('mermaid-')||f==='theme.test.cjs')&&f.endsWith('.test.cjs')&&f!=='mermaid-check.test.cjs').map(f=>desktop+f);
files.push(...readdirSync(plugin).filter(f=>f.endsWith('.test.cjs')&&(!unit||f!=='core-integration.test.cjs')).map(f=>plugin+f));
const result=spawnSync(process.execPath,['--test',...files],{stdio:'inherit'});
if(result.error)throw result.error;
process.exitCode=result.status??1;
