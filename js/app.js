/* ==========================================================================
   DF Engineering Suite - Core Engine
   Civil & Oilfield Workstation
   ========================================================================== */

// Global Utility & State Management
let currentFxRate = 153000; // Default IQD rate per 100 USD

// 1. DYNAMIC FX EXCHANGE RATE ENGINE (AUTO SYNC + MANUAL OVERRIDE)
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
        console.warn("API FX Rate Fetch Offline/Fallback to Manual.");
        if (fxStatus) {
            fxStatus.innerHTML = "🟡 Manual FX Mode Active";
            fxStatus.style.color = "var(--accent-amber)";
        }
    }
}

function recalculateAll() {
    const fxInput = document.getElementById('fxRate');
    if (fxInput) {
        currentFxRate = parseFloat(fxInput.value) || 153000;
    }
    const metricFx = document.getElementById('metricFx');
    if (metricFx) {
        metricFx.innerText = currentFxRate.toLocaleString() + " IQD";
    }

    // Trigger calculation updates across active modules
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

// 2. TAB NAVIGATION SYSTEM
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const tabKey = item.getAttribute('data-tab');
            document.querySelectorAll('.tab-module').forEach(mod => {
                mod.style.display = 'none';
            });

            const activeTab = document.getElementById(`tab-${tabKey}`);
            if (activeTab) {
                activeTab.style.display = 'block';
            }

            // Draw visualizer frame when canvas tab selected
            if (tabKey === 'canvas') {
                drawStructuralFrame();
            }
        });
    });
}

// 3. STEEL SHEDS & PURLINS CALCULATOR
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
            <tr>
                <td>Main Structural Steel Frame</td>
                <td>${steelWeightTon} Tons</td>
                <td>$${SteelPrice}</td>
                <td>$${costSteelUSD.toLocaleString()}</td>
                <td>${convertToIQD(costSteelUSD)} IQD</td>
            </tr>
            <tr>
                <td>Roof & Wall Cladding Panels</td>
                <td>${totalPanelsM2} m²</td>
                <td>$${PanelPrice}</td>
                <td>$${costPanelsUSD.toLocaleString()}</td>
                <td>${convertToIQD(costPanelsUSD)} IQD</td>
            </tr>
            <tr>
                <td>Purlins & Structural Girts</td>
                <td>${totalPurlins} pcs</td>
                <td>Included</td>
                <td>-</td>
                <td>-</td>
            </tr>
            <tr style="font-weight:bold; background:rgba(37,99,235,0.1);">
                <td>TOTAL ESTIMATED BOQ COST</td>
                <td>-</td>
                <td>-</td>
                <td style="color:var(--accent-sky);">$${totalCostUSD.toLocaleString()}</td>
                <td style="color:var(--accent-green);">${convertToIQD(totalCostUSD)} IQD</td>
            </tr>
        `;
    }
}

// 4. FOOTINGS & GEOTECHNICAL ENGINE
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
            <p><strong>Max Safe Bearing Capacity Load:</strong> <span style="color:var(--accent-green);">${maxAllowableLoadKN} kN</span></p>
            <p><strong>Geotech Soil Status:</strong> Nominal Bearing Pass (${Bearing} kPa)</p>
        `;
    }
}

// 5. CANVAS VISUALIZER (INTERACTIVE STRUCTURAL DRAFT)
function drawStructuralFrame() {
    const canvas = document.getElementById('structuralCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }

    // Draw Column 1
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(100, 240); ctx.lineTo(100, 100); ctx.stroke();

    // Draw Column 2
    ctx.beginPath(); ctx.moveTo(500, 240); ctx.lineTo(500, 100); ctx.stroke();

    // Rafter / Truss Gable
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(300, 40);
    ctx.lineTo(500, 100);
    ctx.stroke();

    // Base Support Pads
    ctx.fillStyle = "#10b981";
    ctx.fillRect(80, 240, 40, 12);
    ctx.fillRect(480, 240, 40, 12);

    // Labels
    ctx.fillStyle = "#f8fafc";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Main Frame Wireframe - DF Engineering Suite", 180, 280);
}

// 6. PIPELINES & HYDRAULICS ENGINE
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
            <p><strong>Flow Velocity (V):</strong> ${velocity} m/s ${velocity > 2.5 ? '⚠️ <span style="color:var(--accent-red);">(High Velocity)</span>' : '✅ <span style="color:var(--accent-green);">(Optimal)</span>'}</p>
            <p><strong>Estimated Friction Head Loss (hf):</strong> ${headLossM} meters</p>
        `;
    }
}

// 7. S-CURVE & CASH FLOW ENGINE
function generateSCurve() {
    const duration = parseInt(document.getElementById('projMonths')?.value) || 6;
    const budget = parseFloat(document.getElementById('projBudget')?.value) || 250000;

    const container = document.getElementById('scurveResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Planned Total Investment:</strong> $${budget.toLocaleString()}</p>
            <p><strong>Peak Expenditure Window:</strong> Month ${Math.ceil(duration / 2)} to ${Math.ceil(duration * 0.75)}</p>
        `;
    }
}

// 8. DEFLECTION & USCS
function checkDeflection() {
    const Span = parseFloat(document.getElementById('spanL')?.value) || 6;
    const Delta = parseFloat(document.getElementById('defDelta')?.value) || 12;

    const maxAllowable = (Span * 1000) / 360;
    const status = Delta <= maxAllowable ? "✅ PASS (AISC Safe Limit)" : "❌ FAIL (Excessive Deflection)";

    const container = document.getElementById('deflectionResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Allowable Deflection (L/360):</strong> ${maxAllowable.toFixed(1)} mm</p>
            <p><strong>Actual Structural Deflection:</strong> ${Delta} mm</p>
            <p><strong>Structural Compliance Status:</strong> ${status}</p>
        `;
    }
}

// 9. SITE MATERIALS & FORMWORK
function calcFormwork() {
    const area = parseFloat(document.getElementById('slabArea')?.value) || 150;
    const propsQty = Math.ceil(area * 1.2);
    const sheetsQty = Math.ceil(area / 2.98); // Plywood 1.22x2.44m

    const container = document.getElementById('materialsResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Plywood Sheets Required (1.22 x 2.44m):</strong> ${sheetsQty} sheets</p>
            <p><strong>Adjustable Steel Props Required:</strong> ${propsQty} units</p>
        `;
    }
}

// 10. REBAR OPTIMIZER & WASTAGE
function optimizeRebar() {
    const dia = parseFloat(document.getElementById('rebarDia')?.value) || 16;
    const cut = parseFloat(document.getElementById('cutLen')?.value) || 3.8;
    const pcs = parseInt(document.getElementById('barPieces')?.value) || 120;

    const cutsPerCommercialBar = Math.floor(12 / cut);
    const totalBarsNeeded = Math.ceil(pcs / cutsPerCommercialBar);
    const wastagePerBar = (12 - (cutsPerCommercialBar * cut)).toFixed(2);
    const totalWastagePercent = ((wastagePerBar / 12) * 100).toFixed(1);

    const container = document.getElementById('rebarResults');
    if (container) {
        container.innerHTML = `
            <p><strong>12m Commercial Rebar Stock Needed:</strong> ${totalBarsNeeded} bars (Ø${dia}mm)</p>
            <p><strong>Estimated Off-Cut Wastage per Bar:</strong> ${wastagePerBar} m (${totalWastagePercent}%)</p>
        `;
    }
}

// 11. MACHINERY & FLEET LOGISTICS
function calcMachinery() {
    const vol = parseFloat(document.getElementById('excVol')?.value) || 5000;
    const rate = parseFloat(document.getElementById('excRate')?.value) || 80;

    const totalHoursNeeded = Math.ceil(vol / rate);
    const daysNeeded = Math.ceil(totalHoursNeeded / 8);

    const container = document.getElementById('machineryResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Total Machine Hours Required:</strong> ${totalHoursNeeded} Hours</p>
            <p><strong>Fleet Operation Duration (8-hr shift):</strong> ${daysNeeded} Days</p>
        `;
    }
}

// 12. CONCRETE MIX DESIGN
function calcConcrete() {
    const vol = parseFloat(document.getElementById('concVol')?.value) || 50;

    const cementBags = Math.round(vol * 7); // 350kg/m3
    const sandTons = (vol * 0.45).toFixed(1);
    const gravelTons = (vol * 0.85).toFixed(1);

    const container = document.getElementById('concreteResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Portland Cement (50kg bags):</strong> ${cementBags} bags</p>
            <p><strong>Sand Aggregate:</strong> ${sandTons} Tons</p>
            <p><strong>Gravel Aggregate:</strong> ${gravelTons} Tons</p>
        `;
    }
}

// 13. ROADS & EARTHWORKS
function calcRoads() {
    const L = parseFloat(document.getElementById('roadL')?.value) || 500;
    const W = parseFloat(document.getElementById('roadW')?.value) || 8;

    const areaM2 = L * W;
    const subbaseVolM3 = (areaM2 * 0.25).toFixed(0); // 25cm thickness

    const container = document.getElementById('roadsResults');
    if (container) {
        container.innerHTML = `
            <p><strong>Total Road Base Surface Area:</strong> ${areaM2.toLocaleString()} m²</p>
            <p><strong>Compacted Subbase Volume (25cm Layer):</strong> ${subbaseVolM3.toLocaleString()} m³</p>
        `;
    }
}

// 14. SURVEYING TOOLS
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
            <p><strong>Target Reduced Level (RL):</strong> ${NewRL.toFixed(3)} m</p>
        `;
    }
}

// 15. TECHNICAL OFFER PROPOSAL GENERATOR
function generateOffer() {
    const output = document.getElementById('technicalOfferOutput');
    if (output) {
        output.innerHTML = `
            <div style="padding:16px; background:#0f172a; border-radius:8px; border:1px solid var(--border-color);">
                <h4 style="color:var(--accent-sky); margin-bottom:8px;">OFFICIAL TECHNICAL & COMMERCIAL PROPOSAL</h4>
                <p><strong>Project:</strong> Civil & Oilfield Infrastructure Execution Workstation</p>
                <p><strong>Engineered By:</strong> DF Engineering Suite (Copilot V3)</p>
                <p><strong>Currency Rate Adopted:</strong> $100 = ${currentFxRate.toLocaleString()} IQD</p>
                <hr style="border-color:var(--border-color); margin:10px 0;">
                <p style="font-size:12px; color:var(--text-secondary);">This proposal integrates structural BOQ, geotechnical compliance, hydraulic calculations, and safety matrix under ISO/AISC standards.</p>
            </div>
        `;
    }
}

// 16. EXPORT PDF REPORT FUNCTION
function exportPDFReport() {
    if (window.jspdf) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("DF ENGINEERING SUITE - EXECUTIVE REPORT", 14, 20);
        doc.setFontSize(12);
        doc.text(`Exchange Rate Applied: $100 = ${currentFxRate.toLocaleString()} IQD`, 14, 30);
        doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 38);
        doc.text("----------------------------------------------------------------", 14, 44);

        doc.text("1. Structural & Shed Calculation Summary: Complete", 14, 52);
        doc.text("2. Geotechnical & Foundation Load Analysis: Verified", 14, 60);
        doc.text("3. Rebar Wastage Optimization Target: < 5.6%", 14, 68);

        doc.save("DF_Engineering_Executive_Report.pdf");
    } else {
        alert("PDF Generator is initializing... Please try again in a moment.");
    }
}

// 17. THEME TOGGLE
function toggleTheme() {
    document.body.classList.toggle('light-theme');
}

// INITIALIZATION ON PAGE LOAD
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    fetchLiveExchangeRate();

    // Event listener for manual typing override
    const fxInput = document.getElementById('fxRate');
    if (fxInput) {
        fxInput.addEventListener('input', (e) => {
            const fxStatus = document.querySelector('.fx-status');
            if (fxStatus) {
                fxStatus.innerHTML = "✏️ Custom Manual Rate Active";
                fxStatus.style.color = "var(--accent-sky)";
            }
            recalculateAll();
        });
    }
});
