import express from 'express';
import Provider from '../models/Provider.js';

const router = express.Router();

// Mock fallback data if MongoDB not connected
const MOCK_PROVIDERS = [
  { _id:'1', name:'Dr. Priya Sharma', specialty:'OB-GYN', sub:'High-Risk Pregnancy', location:'Mumbai', rating:4.9, reviews:312, yearsExp:14, bio:'Specialist in high-risk pregnancy and minimally invasive surgery.', tags:['OB-GYN','Pregnancy'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=priya', available:true },
  { _id:'2', name:'Meena Krishnan', specialty:'Midwife', sub:'Water Birth', location:'Bangalore', rating:4.8, reviews:198, yearsExp:9, bio:'Certified midwife with a philosophy of evidence-based gentle birth.', tags:['Midwife','Birth'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=meena', available:true },
  { _id:'3', name:'Ananya Desai', specialty:'Doula', sub:'Postpartum Support', location:'Remote', rating:5.0, reviews:87, yearsExp:6, bio:'Trained birth and postpartum doula dedicated to holistic family support.', tags:['Doula','Postpartum'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=ananya', available:true },
  { _id:'4', name:'Dr. Rohit Menon', specialty:'Pediatrics', sub:'Neonatal Care', location:'Chennai', rating:4.7, reviews:256, yearsExp:12, bio:'Neonatologist with expertise in premature infant care.', tags:['Pediatrics','Neonatal'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=rohit', available:true },
  { _id:'5', name:'Sunita Kapoor', specialty:'Mental Health', sub:'Perinatal Psychiatry', location:'Remote', rating:4.9, reviews:143, yearsExp:10, bio:'Perinatal mental health specialist, CBT and mindfulness-based therapy.', tags:['Mental Health','Therapy'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=sunita', available:true },
  { _id:'6', name:'Dr. Kavitha Rao', specialty:'OB-GYN', sub:'Fertility & IVF', location:'Hyderabad', rating:4.8, reviews:289, yearsExp:16, bio:'Reproductive endocrinologist specializing in IVF and fertility preservation.', tags:['OB-GYN','Fertility'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=kavitha', available:true },
  { _id:'7', name:'Lakshmi Nair', specialty:'Lactation', sub:'IBCLC Consultant', location:'Remote', rating:5.0, reviews:201, yearsExp:8, bio:'Board-certified lactation consultant supporting breastfeeding journeys.', tags:['Lactation','Postpartum'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=lakshmi', available:true },
  { _id:'8', name:'Dr. Arjun Bedi', specialty:'Pediatrics', sub:'Developmental Pediatrics', location:'Delhi', rating:4.6, reviews:178, yearsExp:11, bio:'Expert in child development, autism spectrum, and learning differences.', tags:['Pediatrics','Development'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=arjun', available:true },
  { _id:'9', name:'Preeti Joshi', specialty:'Mental Health', sub:'Trauma & Grief', location:'Remote', rating:4.9, reviews:112, yearsExp:7, bio:'Therapist specializing in perinatal loss, trauma, and anxiety.', tags:['Mental Health','Grief'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=preeti', available:true },
  { _id:'10', name:'Divya Menon', specialty:'Doula', sub:'VBAC Support', location:'Kochi', rating:4.8, reviews:94, yearsExp:5, bio:'VBAC-supportive doula and hypnobirthing practitioner.', tags:['Doula','Birth'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=divya', available:true },
  { _id:'11', name:'Dr. Sneha Pillai', specialty:'OB-GYN', sub:'Endometriosis', location:'Pune', rating:4.9, reviews:221, yearsExp:13, bio:'Minimally invasive gynecologic surgery and endometriosis specialist.', tags:['OB-GYN','Surgery'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=sneha', available:true },
  { _id:'12', name:'Ritu Agarwal', specialty:'Midwife', sub:'Home Birth', location:'Jaipur', rating:4.7, reviews:65, yearsExp:7, bio:'Licensed midwife providing personalized home birth experiences.', tags:['Midwife','Birth'], avatar:'https://api.dicebear.com/7.x/personas/svg?seed=ritu', available:true },
];

router.get('/', async (req, res) => {
  const { specialty } = req.query;
  try {
    let query = {};
    if (specialty && specialty !== 'All') query.specialty = specialty;
    const providers = await Provider.find(query).sort({ rating: -1 }).limit(50);
    if (providers.length === 0) throw new Error('empty');
    res.json(providers);
  } catch {
    let data = MOCK_PROVIDERS;
    if (specialty && specialty !== 'All') {
      data = MOCK_PROVIDERS.filter(p => p.specialty === specialty || p.tags.includes(specialty));
    }
    res.json(data);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ error: 'Not found' });
    res.json(provider);
  } catch {
    const provider = MOCK_PROVIDERS.find(p => p._id === req.params.id);
    if (!provider) return res.status(404).json({ error: 'Not found' });
    res.json(provider);
  }
});

export default router;
