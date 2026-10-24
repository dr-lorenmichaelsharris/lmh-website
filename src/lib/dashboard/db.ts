import mysql from 'mysql2/promise';
import legacy from '../../data/episodes.json' with {type:'json'};
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
type Row=Record<string,unknown>;
let pool:ReturnType<typeof mysql.createPool>|undefined;let sqlite:DatabaseSync|undefined;
export function localDatabase(){return process.env.DASHBOARD_LOCAL_DB==='true'&&process.env.SITE_ENV!=='production'&&!process.env.HOSTINGER_PREVIEW_HOST;}
export function databaseConfigured(){return localDatabase()||!!(process.env.MYSQL_DATABASE&&process.env.MYSQL_USER&&process.env.MYSQL_PASSWORD);}
async function rawQuery(sql:string,values:(string|number|boolean|Uint8Array|Buffer|null)[]=[]):Promise<Row[]>{
 if(localDatabase()){if(!sqlite){await mkdir('.local',{recursive:true});sqlite=new DatabaseSync(resolve('.local/dashboard.sqlite'));sqlite.exec('PRAGMA journal_mode = WAL');}const statement=sqlite.prepare(sql);return sql.trim().match(/^(SELECT|PRAGMA)/i)?statement.all(...values as never[]) as Row[]:[{affectedRows:Number(statement.run(...values as never[]).changes)}];}
 if(!databaseConfigured())throw new Error('Dashboard database is not configured.');
 pool??=mysql.createPool({host:process.env.MYSQL_HOST||'127.0.0.1',port:Number(process.env.MYSQL_PORT)||3306,user:process.env.MYSQL_USER,password:process.env.MYSQL_PASSWORD,database:process.env.MYSQL_DATABASE,charset:'utf8mb4',connectionLimit:5,connectTimeout:8000,timezone:'Z'});
 const [rows]=await pool.execute(sql,values.map(v=>v instanceof Uint8Array?Buffer.from(v):v));return Array.isArray(rows)?rows as Row[]:[{affectedRows:(rows as {affectedRows?:number}).affectedRows||0}];
}
export async function migrate(){const blob=localDatabase()?'BLOB':'LONGBLOB';const text=localDatabase()?'TEXT':'MEDIUMTEXT';
 for(const sql of [
 `CREATE TABLE IF NOT EXISTS lmh_episodes (id VARCHAR(64) PRIMARY KEY, slug VARCHAR(190) NOT NULL UNIQUE, payload ${text} NOT NULL, updated_at VARCHAR(32) NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS lmh_applications (id VARCHAR(64) PRIMARY KEY, submission_key VARCHAR(64) NOT NULL UNIQUE, revision INTEGER NOT NULL DEFAULT 0, payload ${text} NOT NULL, updated_at VARCHAR(32) NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS lmh_media (id VARCHAR(64) PRIMARY KEY, mime VARCHAR(40) NOT NULL, bytes ${blob} NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL)`,
 'CREATE TABLE IF NOT EXISTS lmh_auth (token_hash VARCHAR(64) PRIMARY KEY, kind VARCHAR(20) NOT NULL, email VARCHAR(254) NOT NULL, expires_at VARCHAR(32) NOT NULL)',
 'CREATE TABLE IF NOT EXISTS lmh_audit (id VARCHAR(64) PRIMARY KEY, actor VARCHAR(254) NOT NULL, action VARCHAR(80) NOT NULL, target VARCHAR(64) NOT NULL, created_at VARCHAR(32) NOT NULL)',
 'CREATE TABLE IF NOT EXISTS lmh_limits (id VARCHAR(64) PRIMARY KEY, attempts INTEGER NOT NULL, expires_at VARCHAR(32) NOT NULL)'
 ])await rawQuery(sql);
 try{await rawQuery('SELECT revision FROM lmh_applications LIMIT 0');}catch{await rawQuery('ALTER TABLE lmh_applications ADD COLUMN revision INTEGER NOT NULL DEFAULT 0');}
 for(const e of legacy){const [old]=await rawQuery('SELECT id FROM lmh_episodes WHERE id = ?',[e.id]);if(!old){const record={id:e.id,slug:e.id,guest:e.guest,title:e.title,biography:'',description:e.summary,date:'',banner:'/media/episode-'+e.id+'.jpg',liveUrl:'',replayUrl:e.watchUrl,highlights:'',transcript:'',published:true,cancelled:false,sourceUrl:e.sourceUrl,legacy:true};await rawQuery('INSERT INTO lmh_episodes (id,slug,payload,updated_at) VALUES (?,?,?,?)',[e.id,e.id,JSON.stringify(record),new Date().toISOString()]);}}

}

let ready:Promise<void>|undefined;
export async function query(sql:string,values:(string|number|boolean|Uint8Array|Buffer|null)[]=[]):Promise<Row[]>{if(process.env.DASHBOARD_AUTO_MIGRATE==='true')await (ready??=migrate().catch(error=>{ready=undefined;throw error;}));return rawQuery(sql,values);}
