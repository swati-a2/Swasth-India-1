import express from 'express';

const router = express.Router();

/**
 * POST /api/calculator
 * Body: { companySize: number, planType: 'basic'|'standard'|'premium' }
 * Returns: annual savings, ROI %, breakeven months, chart data points
 */
router.post('/', (req, res) => {
  const { companySize = 100, planType = 'standard' } = req.body;

  const planCostPerEmployee = { basic: 480, standard: 720, premium: 1080 };
  const costPerEmployee = planCostPerEmployee[planType] ?? 720;

  // Industry benchmarks (source: KPMG India Maternal Health Report)
  const avgMaternalCostWithout = 1800;   // INR/employee/year without support
  const avgMaternalCostWith    = 980;    // INR/employee/year with Swasth
  const productivityGainPerEmp = 620;    // INR/year from reduced absenteeism
  const retentionSavingPerEmp  = 340;    // INR/year from lower attrition

  const totalBenefitsPerEmp =
    (avgMaternalCostWithout - avgMaternalCostWith) +
    productivityGainPerEmp +
    retentionSavingPerEmp;

  const totalCost     = companySize * costPerEmployee;
  const totalBenefit  = companySize * totalBenefitsPerEmp;
  const netBenefit    = totalBenefit - totalCost;
  const roiPercent    = Math.round((netBenefit / totalCost) * 100);
  const breakevenMonths = Math.ceil(12 / (totalBenefit / totalCost));

  // Chart: monthly cumulative savings over 12 months
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      month,
      cumulativeSaving: Math.round((totalBenefit / 12) * month - totalCost * (month / 12)),
      cumulativeCost:   Math.round(totalCost * (month / 12)),
    };
  });

  res.json({
    companySize,
    planType,
    costPerEmployee,
    totalCost,
    totalBenefit,
    netBenefit,
    roiPercent,
    breakevenMonths,
    chartData,
  });
});

export default router;
