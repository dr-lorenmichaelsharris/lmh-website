export function visibleEvidence(data: {publish:boolean; approvalStatus:string; previewOnly?:boolean}, production:boolean) {
  return (data.publish && data.approvalStatus === 'approved' && !data.previewOnly) || (!production && data.previewOnly === true);
}
