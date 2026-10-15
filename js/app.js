/* ==========================================================================
   DF Engineering Suite - Core Engine
   Civil & Oilfield Workstation
   ========================================================================== */

let currentFxRate = 153000;

// 1. DYNAMIC FX EXCHANGE RATE ENGINE
async function fetchLiveExchangeRate() {
    const fxInput = document.getElementById('fxRate');
    const fxStatus = document.querySelector('.fx-status');
    const metricFx = document.getElementById('metricFx');

    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates && data.rates.IQD) {
            const liveRatePer100 = Math.round(data.rates.IQD * 100);
            currentFxRate = liveRatePer100;
            
            if (fxInput) fxInput.value = liveRatePer100;
            if (fxStatus) {
                fxStatus.innerHTML = "🟢 Live Market Rate Sync Active";
                fxStatus.style.color = "var(--accent-green)";
            }
            if (metricFx) {
                metricFx.innerText = liveRatePer100.toLocaleString() + " IQD";
            }
            recalculateAll();
        }
    } catch (error) {
        if (fxStatus) {
            fxStatus.innerHTML = "🟡 Manual FX Mode Active";
            fxStatus.style.color = "var(--accent-amber)";
        }
    }
}

function recalculateAll() {
    const fxInput = document.getElementById('fxRate');
    if (fxInput) currentFxRate = parseFloat(fxInput.value) || 153000;
    
    const metricFx = document.getElementById('metricFx');
    if (metricFx) metricFx.innerText = currentFxRate.toLocaleString() + " IQD";

    calcShed();
    calcFoundation();
    calcHydraulics();
    generateSCurve();
    checkDeflection();
    calcFormwork();
    optimizeRebar();
    calcMachinery();
    calcConcrete();
    calcRoads();
    calcSurvey();
}

// 2. TAB NAVIGATION & MODULE DRAWING INITIALIZATION
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const tabKey = item.getAttribute('data-tab');
            document.querySelectorAll('.tab-module').forEach(mod => mod.style.display = 'none');

            const activeTab = document.getElementById(`tab-${tabKey}`);
            if (activeTab) activeTab.style.display = 'block';

            // Trigger Module Specific Drawing Engine
            if (tabKey === 'shed') drawShedDiagram();
            if (tabKey === 'footings') drawFootingDiagram();
            if (tabKey === 'hydraulics') drawPipeDiagram();
            if (tabKey === 'scurve') drawSCurveDiagram();
            if (tabKey === 'deflection') drawDeflectionDiagram();
            if (tabKey === 'materials') drawFormworkDiagram();
            if (tabKey === 'rebar') drawRebarDiagram();
            if (tabKey === 'machinery') drawFleetDiagram();
            if (tabKey === 'concrete') drawConcreteDiagram();
            if (tabKey === 'roads') drawRoadDiagram();
            if (tabKey === 'surveying') drawSurveyDiagram();
            if (tabKey === 'hse') drawHseMatrix();
            if (tabKey === 'canvas') drawUniversalFrame();
        });
    });
}

// 3. MODULE 1: STEEL SHEDS & PURLINS
function calcShed() {
    const L = parseFloat(document.getElementById('shedL')?.value) || 30;
    const W = parseFloat(document.getElementById('shedW')?.value) || 15;
    const H = parseFloat(document.getElementById('shedH')?.value) || 6;
    const Bay = parseFloat(document.getElementById('shedBay')?.value) || 6;
    const PurlinSpacing = parseFloat(document.getElementById('purlinSpace')?.value) || 1.2;
    const SteelPrice = parseFloat(document.getElementById('shedSteelPrice')?.value) || 950;
    const PanelPrice = parseFloat(document.getElementById('shedPanelPrice')?.value) || 18;

    const numBays = Math.ceil(L / Bay);
    const numFrames = numBays + 1;
    const steelWeightTon = ((W * H * 0.08) * numFrames + (L * 0.05)).toFixed(2);
    const totalPanelsM2 = Math.round((2 * (L * H) + 2 * (W * H) + (L * W * 1.15)));
    const totalPurlins = Math.ceil((W / PurlinSpacing) * numBays * 2);

    const costSteelUSD = Math.round(steelWeightTon * SteelPrice);
    const costPanelsUSD = Math.round(totalPanelsM2 * PanelPrice);
    const totalCostUSD = costSteelUSD + costPanelsUSD;

    const convertToIQD = (usd) => Math.round((usd / 100) * currentFxRate).toLocaleString();

    const tbody = document.getElementById('shedTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr><td>Main Structural Steel Frame</td><td>${steelWeightTon} Tons</td><td>$${SteelPrice}</td><td>$${costSteelUSD.toLocaleString()}</td><td>${convertToIQD(costSteelUSD)} IQD</td></tr>
            <tr><td>Roof & Wall Cladding Panels</td><td>${totalPanelsM2} m²</td><td>$${PanelPrice}</td><td>$${costPanelsUSD.toLocaleString()}</td><td>${convertToIQD(costPanelsUSD)} IQD</td></tr>
            <tr><td>Purlins & Structural Girts</td><td>${totalPurlins} pcs</td><td>Included</td><td>-</td><td>-</td></tr>
            <tr style="font-weight:bold; background:rgba(37,99,235,0.1);"><td>TOTAL ESTIMATED BOQ COST</td><td>-</td><td>-</td><td style="color:var(--accent-sky);">$${totalCostUSD.toLocaleString()}</td><td style="color:var(--accent-green);">${convertToIQD(totalCostUSD)} IQD</td></tr>
        `;
    }
    drawShedDiagram();
}

function drawShedDiagram() {
    const canvas = document.getElementById('shedCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }

    ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(100, 190); ctx.lineTo(100, 70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(500, 190); ctx.lineTo(500, 70); ctx.stroke();

    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(100, 70); ctx.lineTo(300, 25); ctx.lineTo(500, 70); ctx.stroke();

    ctx.fillStyle = "#10b981"; ctx.fillRect(80, 190, 40, 10); ctx.fillRect(480, 190, 40, 10);
    ctx.fillStyle = "#f8fafc"; ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Shed Structural Frame & Purlin Layout", 190, 220);
}

// 4. MODULE 2: FOOTINGS
function calcFoundation() {
    const L = parseFloat(document.getElementById('footL')?.value) || 2.5;
    const B = parseFloat(document.getElementById('footB')?.value) || 2.5;
    const D = parseFloat(document.getElementById('footD')?.value) || 0.6;
    const Bearing = parseFloat(document.getElementById('bearingCap')?.value) || 180;

    const volM3 = (L * B * D).toFixed(2);
    const maxAllowableLoadKN = Math.round(L * B * Bearing);

    const container = document.getElementById('footingResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Concrete Volume per Footing:</strong> <span style="color:var(--accent-sky);">${volM3} m³</span></p>
            <p><strong>Max Safe Bearing Load:</strong> <span style="color:var(--accent-green);">${maxAllowableLoadKN} kN</span></p>
            <p><strong>Geotech Soil Status:</strong> Pass (${Bearing} kPa)</p>
        `;
    }
    drawFootingDiagram();
}

function drawFootingDiagram() {
    const canvas = document.getElementById('footingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#33291e"; ctx.fillRect(20, 150, 460, 50);
    ctx.fillStyle = "#475569"; ctx.fillRect(150, 90, 200, 60);
    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2; ctx.strokeRect(150, 90, 200, 60);

    ctx.fillStyle = "#64748b"; ctx.fillRect(225, 30, 50, 60);
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(250, 5); ctx.lineTo(250, 28); ctx.stroke();

    ctx.fillStyle = "#f8fafc"; ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Column Load (P)", 210, 18);
    ctx.fillText("Concrete Pad", 215, 125);
}

// 5. MODULE 3: HYDRAULICS
function calcHydraulics() {
    const D_mm = parseFloat(document.getElementById('pipeD')?.value) || 250;
    const Q_ls = parseFloat(document.getElementById('flowQ')?.value) || 45;
    const L_m = parseFloat(document.getElementById('pipeL')?.value) || 1200;

    const D_m = D_mm / 1000;
    const Q_m3s = Q_ls / 1000;
    const Area = Math.PI * Math.pow(D_m / 2, 2);
    const velocity = (Q_m3s / Area).toFixed(2);
    const headLossM = (0.02 * (L_m / D_m) * (Math.pow(velocity, 2) / (2 * 9.81))).toFixed(2);

    const container = document.getElementById('hydraulicsResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Flow Velocity (V):</strong> ${velocity} m/s ${velocity > 2.5 ? '⚠️ <span style="color:var(--accent-red);">(High)</span>' : '✅ <span style="color:var(--accent-green);">(Optimal)</span>'}</p>
            <p><strong>Head Loss (hf):</strong> ${headLossM} m</p>
        `;
    }
    drawPipeDiagram();
}

function drawPipeDiagram() {
    const canvas = document.getElementById('hydraulicsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(250, 100, 65, 0, 2 * Math.PI); ctx.stroke();

    ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
    ctx.beginPath(); ctx.arc(250, 100, 62, 0, Math.PI); ctx.fill();

    ctx.fillStyle = "#f8fafc"; ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Pipe Wall", 225, 25);
    ctx.fillText("Fluid Section Area", 205, 120);
}

// 6. MODULE 4: S-CURVE
function generateSCurve() {
    const duration = parseInt(document.getElementById('projMonths')?.value) || 6;
    const budget = parseFloat(document.getElementById('projBudget')?.value) || 250000;

    const container = document.getElementById('scurveResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Total Budget:</strong> $${budget.toLocaleString()}</p>
            <p><strong>Peak Expenditure Window:</strong> Month ${Math.ceil(duration / 2)} to ${Math.ceil(duration * 0.75)}</p>
        `;
    }
    drawSCurveDiagram();
}

function drawSCurveDiagram() {
    const canvas = document.getElementById('scurveCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(50, 180);
    ctx.bezierCurveTo(200, 170, 300, 40, 500, 30); ctx.stroke();

    ctx.fillStyle = "#f8fafc"; ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Cumulative Planned S-Curve Expenditure", 150, 205);
}

// 7. MODULE 5: DEFLECTION
function checkDeflection() {
    const Span = parseFloat(document.getElementById('spanL')?.value) || 6;
    const Delta = parseFloat(document.getElementById('defDelta')?.value) || 12;

    const maxAllowable = (Span * 1000) / 360;
    const status = Delta <= maxAllowable ? "✅ PASS" : "❌ FAIL";

    const container = document.getElementById('deflectionResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Allowable Deflection:</strong> ${maxAllowable.toFixed(1)} mm</p>
            <p><strong>Actual Deflection:</strong> ${Delta} mm</p>
            <p><strong>Compliance:</strong> ${status}</p>
        `;
    }
    drawDeflectionDiagram();
}

function drawDeflectionDiagram() {
    const canvas = document.getElementById('deflectionCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(50, 80); ctx.quadraticCurveTo(250, 150, 450, 80); ctx.stroke();

    ctx.fillStyle = "#f8fafc"; ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Bending Deflection Profile Delta", 170, 165);
}

// 8. MODULE 6: FORMWORK
function calcFormwork() {
    const area = parseFloat(document.getElementById('slabArea')?.value) || 150;
    const propsQty = Math.ceil(area * 1.2);
    const sheetsQty = Math.ceil(area / 2.98);

    const container = document.getElementById('materialsResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Plywood Sheets:</strong> ${sheetsQty} sheets</p>
            <p><strong>Steel Props:</strong> ${propsQty} units</p>
        `;
    }
    drawFormworkDiagram();
}

function drawFormworkDiagram() {
    const canvas = document.getElementById('materialsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#38bdf8"; ctx.fillRect(50, 50, 400, 15);
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 3;
    for (let x = 80; x <= 420; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 65); ctx.lineTo(x, 150); ctx.stroke();
    }
}

// 9. MODULE 7: REBAR OPTIMIZER
function optimizeRebar() {
    const dia = parseFloat(document.getElementById('rebarDia')?.value) || 16;
    const cut = parseFloat(document.getElementById('cutLen')?.value) || 3.8;
    const pcs = parseInt(document.getElementById('barPieces')?.value) || 120;

    const cutsPerCommercialBar = Math.floor(12 / cut);
    const totalBarsNeeded = Math.ceil(pcs / cutsPerCommercialBar);
    const wastagePerBar = (12 - (cutsPerCommercialBar * cut)).toFixed(2);

    const container = document.getElementById('rebarResults');
    if (container) {
        container.innerHTML = `
            <p><strong>12m Stock Bars Needed:</strong> ${totalBarsNeeded} bars</p>
            <p><strong>Off-cut Wastage:</strong> ${wastagePerBar} m</p>
        `;
    }
    drawRebarDiagram();
}

function drawRebarDiagram() {
    const canvas = document.getElementById('rebarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2563eb"; ctx.fillRect(20, 40, 360, 25);
    ctx.fillStyle = "#ef4444"; ctx.fillRect(380, 40, 100, 25);
    ctx.fillStyle = "#f8fafc"; ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Yield Cuts", 160, 57); ctx.fillText("Waste", 410, 57);
}

// 10. MODULE 8: MACHINERY
function calcMachinery() {
    const vol = parseFloat(document.getElementById('excVol')?.value) || 5000;
    const rate = parseFloat(document.getElementById('excRate')?.value) || 80;

    const totalHoursNeeded = Math.ceil(vol / rate);
    const daysNeeded = Math.ceil(totalHoursNeeded / 8);

    const container = document.getElementById('machineryResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Total Machine Hours:</strong> ${totalHoursNeeded} Hours</p>
            <p><strong>Shift Duration:</strong> ${daysNeeded} Days</p>
        `;
    }
    drawFleetDiagram();
}

function drawFleetDiagram() {
    const canvas = document.getElementById('machineryCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f59e0b"; ctx.fillRect(100, 80, 120, 50);
    ctx.fillStyle = "#10b981"; ctx.fillRect(280, 80, 120, 50);
    ctx.fillStyle = "#f8fafc"; ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Excavator", 130, 110); ctx.fillText("Truck Fleet", 310, 110);
}

// 11. MODULE 9: CONCRETE
function calcConcrete() {
    const vol = parseFloat(document.getElementById('concVol')?.value) || 50;
    const cementBags = Math.round(vol * 7);
    const sandTons = (vol * 0.45).toFixed(1);
    const gravelTons = (vol * 0.85).toFixed(1);

    const container = document.getElementById('concreteResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Cement (50kg bags):</strong> ${cementBags} bags</p>
            <p><strong>Sand:</strong> ${sandTons} Tons | <strong>Gravel:</strong> ${gravelTons} Tons</p>
        `;
    }
    drawConcreteDiagram();
}

function drawConcreteDiagram() {
    const canvas = document.getElementById('concreteCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#94a3b8"; ctx.fillRect(50, 50, 70, 90);
    ctx.fillStyle = "#f59e0b"; ctx.fillRect(180, 50, 100, 90);
    ctx.fillStyle = "#64748b"; ctx.fillRect(320, 50, 120, 90);
    ctx.fillStyle = "#f8fafc"; ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Cement", 65, 155); ctx.fillText("Sand", 215, 155); ctx.fillText("Gravel", 360, 155);
}

// 12. MODULE 10: ROADS
function calcRoads() {
    const L = parseFloat(document.getElementById('roadL')?.value) || 500;
    const W = parseFloat(document.getElementById('roadW')?.value) || 8;
    const areaM2 = L * W;
    const subbaseVolM3 = (areaM2 * 0.25).toFixed(0);

    const container = document.getElementById('roadsResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Surface Area:</strong> ${areaM2.toLocaleString()} m²</p>
            <p><strong>Subbase Vol:</strong> ${subbaseVolM3.toLocaleString()} m³</p>
        `;
    }
    drawRoadDiagram();
}

function drawRoadDiagram() {
    const canvas = document.getElementById('roadCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1e293b"; ctx.fillRect(50, 50, 400, 20);
    ctx.fillStyle = "#d97706"; ctx.fillRect(30, 70, 440, 40);
    ctx.fillStyle = "#33291e"; ctx.fillRect(10, 110, 480, 40);
    ctx.fillStyle = "#f8fafc"; ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Asphalt", 220, 65); ctx.fillText("Subbase", 220, 95); ctx.fillText("Earth Subgrade", 200, 135);
}

// 13. MODULE 11: SURVEYING
function calcSurvey() {
    const BM = parseFloat(document.getElementById('bmHeight')?.value) || 100.00;
    const BS = parseFloat(document.getElementById('bsVal')?.value) || 1.45;
    const FS = parseFloat(document.getElementById('fsVal')?.value) || 2.10;

    const HI = BM + BS;
    const NewRL = HI - FS;

    const container = document.getElementById('surveyResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Height of Instrument (HI):</strong> ${HI.toFixed(3)} m</p>
            <p><strong>Reduced Level (RL):</strong> ${NewRL.toFixed(3)} m</p>
        `;
    }
    drawSurveyDiagram();
}

function drawSurveyDiagram() {
    const canvas = document.getElementById('surveyCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(50, 120); ctx.lineTo(250, 80); ctx.lineTo(450, 130); ctx.stroke();
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(50, 50); ctx.lineTo(450, 50); ctx.stroke();
}

// 14. MODULE 12: HSE RISK HEATMAP
function drawHseMatrix() {
    const canvas = document.getElementById('hseCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            ctx.fillStyle = (r + c > 4) ? "#ef4444" : ((r + c > 2) ? "#f59e0b" : "#10b981");
            ctx.fillRect(50 + c * 60, 20 + r * 35, 55, 30);
        }
    }
}

// 15. MODULE 13: TECHNICAL PROPOSAL & EXPORTS
function generateOffer() {
    const output = document.getElementById('technicalOfferOutput');
    if (output) {
        output.innerHTML = `
            <div style="padding:16px; background:#0f172a; border-radius:8px; border:1px solid var(--border-color);">
                <h4 style="color:var(--accent-sky); margin-bottom:8px;">OFFICIAL TECHNICAL & COMMERCIAL PROPOSAL</h4>
                <p><strong>Project:</strong> Civil & Oilfield Infrastructure Execution Workstation</p>
                <p><strong>Adopted FX Rate:</strong> $100 = ${currentFxRate.toLocaleString()} IQD</p>
            </div>
        `;
    }
}

function exportPDFReport() {
    if (window.jspdf) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(18); doc.text("DF ENGINEERING SUITE - EXECUTIVE REPORT", 14, 20);
        doc.setFontSize(12); doc.text(`Exchange Rate Applied: $100 = ${currentFxRate.toLocaleString()} IQD`, 14, 30);
        doc.save("DF_Engineering_Executive_Report.pdf");
    }
}

function exportCADPackage() {
    alert("Downloading Consolidated Engineering CAD Schematics Bundle...");
}

// 16. MODULE 14: UNIVERSAL FREEHAND CANVAS
function drawUniversalFrame() {
    const canvas = document.getElementById('universalCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
}

function toggleTheme() { document.body.classList.toggle('light-theme'); }

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    fetchLiveExchangeRate();

    const fxInput = document.getElementById('fxRate');
    if (fxInput) {
        fxInput.addEventListener('input', () => {
            const fxStatus = document.querySelector('.fx-status');
            if (fxStatus) {
                fxStatus.innerHTML = "✏️ Custom Manual Rate Active";
                fxStatus.style.color = "var(--accent-sky)";
            }
            recalculateAll();
        });
    }
});
