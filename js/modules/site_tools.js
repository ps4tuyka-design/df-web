// Advanced Site & Material Engineering Calculations

// 1. Rebar Unit Weight & Detailed Bar Bending Engine
function calcRebarDetails() {
    const dia = parseFloat(document.getElementById('rebarDia')?.value) || 16; // mm
    const totalLen = parseFloat(document.getElementById('rebarTotalLen')?.value) || 100; // meters
    const priceTon = parseFloat(document.getElementById('rebarPricePerTon')?.value) || 900; // USD

    // Formula: Weight per meter = (d^2) / 162 (kg/m)
    const weightPerMeter = (dia * dia) / 162.0;
    const totalWeightKg = weightPerMeter * totalLen;
    const totalWeightTon = totalWeightKg / 1000.0;
    const totalCostUsd = totalWeightTon * priceTon;

    const factor = typeof CurrencyEngine !== 'undefined' ? CurrencyEngine.getFactor() : 1530;
    const totalCostIqd = totalCostUsd * factor;

    if (document.getElementById('rebarKgPerM')) document.getElementById('rebarKgPerM').innerText = weightPerMeter.toFixed(3) + ' kg/m';
    if (document.getElementById('rebarTotalTon')) document.getElementById('rebarTotalTon').innerText = totalWeightTon.toFixed(3) + ' Ton (' + totalWeightKg.toFixed(1) + ' kg)';
    if (document.getElementById('rebarCostUsd')) document.getElementById('rebarCostUsd').innerText = '$' + Math.round(totalCostUsd).toLocaleString();
    if (document.getElementById('rebarCostIqd')) document.getElementById('rebarCostIqd').innerText = Math.round(totalCostIqd).toLocaleString() + ' IQD';
}

// 2. Formwork & Plywood Sheet Estimator
function calcFormwork() {
    const area = parseFloat(document.getElementById('formworkArea')?.value) || 120; // m2
    const sheetWidth = 1.22;
    const sheetLength = 2.44;
    const sheetArea = sheetWidth * sheetLength; // 2.9768 m2

    const rawSheets = area / sheetArea;
    const totalSheetsWithWaste = Math.ceil(rawSheets * 1.10); // 10% wastage
    const timberPropsCount = Math.ceil(area * 1.5); // ~1.5 props per m2

    if (document.getElementById('formPlywoodSheets')) document.getElementById('formPlywoodSheets').innerText = totalSheetsWithWaste + ' Sheets (1.22x2.44m)';
    if (document.getElementById('formTimberProps')) document.getElementById('formTimberProps').innerText = timberPropsCount + ' Props / Posts';
}

// 3. Blockwork & Mortar Estimator
function calcMasonry() {
    const wallLen = parseFloat(document.getElementById('wallLength')?.value) || 10; // m
    const wallHeight = parseFloat(document.getElementById('wallHeight')?.value) || 3; // m
    const blockLen = 0.40; // 40 cm
    const blockHeight = 0.20; // 20 cm
    
    const wallArea = wallLen * wallHeight;
    const blockArea = blockLen * blockHeight; // 0.08 m2
    
    const rawBlocks = wallArea / blockArea;
    const totalBlocks = Math.ceil(rawBlocks * 1.05); // 5% breakage waste

    // Cement & Sand for Mortar (~0.02 m3 mortar per m2 of wall)
    const totalMortarVol = wallArea * 0.02;
    const cementBags = Math.ceil(totalMortarVol * 6.5); // 6.5 bags per m3 mortar
    const sandVol = (totalMortarVol * 0.9).toFixed(2); // m3 sand

    if (document.getElementById('blockTotalQty')) document.getElementById('blockTotalQty').innerText = totalBlocks + ' Blocks (20x20x40cm)';
    if (document.getElementById('mortarCementBags')) document.getElementById('mortarCementBags').innerText = cementBags + ' Cement Bags (50kg)';
    if (document.getElementById('mortarSandVol')) document.getElementById('mortarSandVol').innerText = sandVol + ' m³ Sand';
}
