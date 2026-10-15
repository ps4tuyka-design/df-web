// Hydraulics, S-Curve Cashflow & Mix Design Module

// 1. Hydraulics & Pressure Drop (Hazen-Williams Equation)
function calcHydraulics() {
    const flowRateLps = parseFloat(document.getElementById('pipeFlow')?.value) || 25; // L/s
    const diaMm = parseFloat(document.getElementById('pipeDia')?.value) || 150; // mm
    const lenM = parseFloat(document.getElementById('pipeLen')?.value) || 200; // m
    const cFactor = parseFloat(document.getElementById('pipeC')?.value) || 130; // PVC / Steel C-factor

    const flowM3s = flowRateLps / 1000.0;
    const diaM = diaMm / 1000.0;

    // Velocity V = Q / A
    const area = (Math.PI / 4.0) * Math.pow(diaM, 2);
    const velocity = flowM3s / area;

    // Head loss hf = 10.67 * L * Q^1.852 / (C^1.852 * d^4.87)
    const headLoss = (10.67 * lenM * Math.pow(flowM3s, 1.852)) / (Math.pow(cFactor, 1.852) * Math.pow(diaM, 4.87));
    const pressDropBar = (headLoss * 0.0980665); // 1 m H2O ≈ 0.0981 bar

    if (document.getElementById('hydVelocity')) document.getElementById('hydVelocity').innerText = velocity.toFixed(2) + ' m/s';
    if (document.getElementById('hydHeadLoss')) document.getElementById('hydHeadLoss').innerText = headLoss.toFixed(2) + ' m H₂O';
    if (document.getElementById('hydPressDrop')) document.getElementById('hydPressDrop').innerText = pressDropBar.toFixed(2) + ' Bar';
}

// 2. Concrete Mix Design & Sand Moisture Correction
function calcMixDesign() {
    const targetVol = parseFloat(document.getElementById('mixVol')?.value) || 10; // m3
    const sandMoisture = parseFloat(document.getElementById('sandMoist')?.value) || 4; // %

    // Standard C30 mix proportion per m3: Cement 380kg, Sand 700kg, Gravel 1150kg, Water 180L
    const baseCementKg = 380 * targetVol;
    const baseSandKg = 700 * targetVol;
    const baseGravelKg = 1150 * targetVol;
    const baseWaterL = 180 * targetVol;

    // Moisture adjustment
    const extraWaterInSand = baseSandKg * (sandMoisture / 100.0);
    const correctedSandKg = baseSandKg + extraWaterInSand;
    const correctedWaterL = baseWaterL - extraWaterInSand;

    if (document.getElementById('mixCementBags')) document.getElementById('mixCementBags').innerText = Math.ceil(baseCementKg / 50) + ' Bags (' + (baseCementKg/1000).toFixed(2) + ' Ton)';
    if (document.getElementById('mixSandKg')) document.getElementById('mixSandKg').innerText = Math.round(correctedSandKg) + ' kg (Moisture Adjusted)';
    if (document.getElementById('mixGravelKg')) document.getElementById('mixGravelKg').innerText = Math.round(baseGravelKg) + ' kg';
    if (document.getElementById('mixWaterL')) document.getElementById('mixWaterL').innerText = Math.round(correctedWaterL) + ' Litres';
}

// 3. Simple S-Curve Cashflow Forecast Generator
function generateSCurve() {
    const totalBudget = parseFloat(document.getElementById('scurveBudget')?.value) || 100000;
    const months = parseInt(document.getElementById('scurveMonths')?.value) || 6;
    
    let container = document.getElementById('scurveOutput');
    if (!container) return;

    let html = '<table style="width:100%; border-collapse:collapse; margin-top:10px; font-size:12px;">';
    html += '<tr style="background:#1E293B; color:#FFF;"><th>Month</th><th>Monthly Progress (%)</th><th>Monthly Spend ($)</th><th>Cumulative Spend ($)</th></tr>';

    let cumulative = 0;
    for (let i = 1; i <= months; i++) {
        // Sigmoid distribution for S-Curve
        let progress = Math.round((100 / (1 + Math.exp(-1 * (i - months / 2)))) - (100 / (1 + Math.exp(months / 2))));
        if (i === months) progress = 100;

        let prevCum = cumulative;
        cumulative = (progress / 100) * totalBudget;
        let monthlySpend = cumulative - prevCum;

        html += `<tr style="border-bottom:1px solid #334155;">
            <td style="padding:6px; text-align:center;">Month ${i}</td>
            <td style="padding:6px; text-align:center;">${progress}%</td>
            <td style="padding:6px; text-align:center;">$${Math.round(monthlySpend).toLocaleString()}</td>
            <td style="padding:6px; text-align:center; font-weight:bold; color:#38BDF8;">$${Math.round(cumulative).toLocaleString()}</td>
        </tr>`;
    }
    html += '</table>';
    container.innerHTML = html;
}
