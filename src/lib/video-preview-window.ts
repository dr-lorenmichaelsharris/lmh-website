/** Stable mid-recording excerpts keep shared show introductions out of previews. */
export function previewWindow(duration:number,ratio?:number,seconds=20) {
 if(!Number.isFinite(duration)||duration<=1||ratio===undefined||!Number.isFinite(ratio))return;
 const start=Math.max(0,Math.min(duration-1,duration*Math.max(.35,Math.min(.65,ratio))));
 return {start,end:Math.min(duration-.25,start+Math.max(1,seconds))};
}
export function previewRatio(id:string) {
 let hash=2166136261;
 for(const char of id)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
 return .35+(hash%3001)/10000;
}
