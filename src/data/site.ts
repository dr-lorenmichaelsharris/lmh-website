export const site = {
 name: 'Loren Michaels Harris', title: 'Dr. Loren Michaels Harris',
 origin: 'https://lorenmichaelsharris.com', email: 'lorenmichaelsharris@gmail.com',
 youtube: 'https://www.youtube.com/@LorenMichaelsHarris/streams',
 book: 'https://fromsplinteredtocentered.com/',
 serviceOrder: ['speaking','coaching','keynote-writing'],
 calendly: 'https://calendly.com/lorenmichaelsharris',
 bookingEvents: {} as Record<string,string>,
};
export const packages = [
 {id:'bronze',name:'Bronze',approvalStatus:'pending',amount:null,productId:null},
 {id:'silver',name:'Silver',approvalStatus:'pending',amount:null,productId:null},
 {id:'gold',name:'Gold',approvalStatus:'pending',amount:null,productId:null},
] as const;
export const serviceIntents=['speaking','coaching','keynote-writing','program','general','guest','newsletter'] as const;
