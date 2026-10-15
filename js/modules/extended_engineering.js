// Extended Engineering Engine: Sandwich Panel, USCS Soil, Steel Database & Deflection

// 1. Sandwich Panel & Screws Estimator
function calcPanels() {
    const area = parseFloat(document.getElementById('pnlArea')?.value) || 250; // m2
    const panelWidth = parseFloat(document.getElementById('pnlWidth')?.value) || 1.0; // 1m effective width
    const panelLength = parseFloat(document.getElementById('pnlLength')?.value) || 6.0; // 6m standard

    const singlePanelArea = panelWidth * panelLength;
    const rawPanels = area / singlePanelArea;
    const totalPanels = Math.ceil(rawPanels * 1.05); // 5% waste
    const totalScrews = Math.ceil(area * 4); // ~4 screws per m2

    if (document.getElementById('pnlCount')) document.getElementById('pnlCount').innerText = `${totalPanels} Panels (${panelLength}m length)`;
    if (document.getElementById('pnlScrews')) document.getElementById('pnlScrews').innerText = `${totalScrews} TEK Screws (Self-Drilling)`;
}

// 2. USCS Soil Classification
function classifySoil() {
    const passNo200 = parseFloat(document.getElementById('soilPass200')?.value) || 25; // % passing #200
    const liquidLimit = parseFloat(document.getElementById('soilLL')?.value) || 35;
    const plasticLimit = parseFloat(document.getElementById('soilPL')?.value) || 20;

    const plasticityIndex = liquidLimit - plasticLimit; // PI
    let soilSymbol = "";
    let soilDesc = "";

    if (passNo200 < 50) {
        // Coarse-Grained Soil
        soilSymbol = "S-G (Sand/Gravel)";
        soilDesc = "Coarse-Grained Soil - Excellent for Sub-base and Foundation Bedding";
    } else {
        // Fine-Grained Soil
        const aLine = 0.73 * (liquidLimit - 20);
        if (plasticityIndex > aLine && plasticityIndex > 7) {
            soilSymbol = liquidLimit > 50 ? "CH (High Plasticity Clay)" : "CL (Lean Clay)";
            soilDesc = liquidLimit > 50 ? "High Plasticity Clay - High Swelling Potential (Warning)" : "Inorganic Lean Clay - Moderate Bearing Capacity";
        } else {
            soilSymbol = liquidLimit > 50 ? "MH (Elastic Silt)" : "ML (Silt)";
            soilDesc = "Inorganic Silt - Moisture Sensitive Soil";
        }
    }

    if (document.getElementById('soilSymbolOut')) document.getElementById('soilSymbolOut').innerText = soilSymbol;
    if (document.getElementById('soilDescOut')) document.getElementById('soilDescOut').innerText = soilDesc;
}

// 3. Beam Deflection Quick Check (Simply Supported Beam with Uniform Load)
function checkDeflection() {
    const spanL = parseFloat(document.getElementById('bmSpan')?.value) || 6.0; // m
    const wLoad = parseFloat(document.getElementById('bmLoad')?.value) || 12.0; // kN/m
    const E = 210000; // N/mm2 (Steel Young's Modulus)
    const Ix = parseFloat(document.getElementById('bmInertia')?.value) || 8356; // cm4 (IPE 300 ~ 8356 cm4)

    // Deflection = (5 * w * L^4) / (384 * E * I)
    const wNmm = wLoad; // kN/m = N/mm
    const Lmm = spanL * 1000;
    const Imm4 = Ix * 10000; // cm4 to mm4

    const delta = (5 * wNmm * Math.pow(Lmm, 4)) / (384 * E * Imm4); // mm
    const deltaAllowable = Lmm / 240; // L/240 standard limit

    const resEl = document.getElementById('bmDeflOut');
    if (resEl) {
        if (delta <= deltaAllowable) {
            resEl.innerHTML = `<span style="color:#10B981; font-weight:bold;">PASS: Deflection ${delta.toFixed(2)} mm ≤ Allowable ${deltaAllowable.toFixed(2)} mm (L/240)</span>`;
        } else {
            resEl.innerHTML = `<span style="color:#EF4444; font-weight:bold;">FAIL: Deflection ${delta.toFixed(2)} mm > Allowable ${deltaAllowable.toFixed(2)} mm (Increase Section Size)</span>`;
        }
    }
}
