// Final Touches: Rebar Lap Splice, Fuel Estimator & Live Canvas Visualizer

// 1. Rebar Lap Splice & Development Length (ACI 318 Standard)
function calcLapSplice() {
    const dia = parseFloat(document.getElementById('lapDia')?.value) || 16; // mm
    const fc = parseFloat(document.getElementById('lapFc')?.value) || 28; // MPa (Concrete Strength)
    const fy = parseFloat(document.getElementById('lapFy')?.value) || 420; // MPa (Rebar Yield)

    // Basic Tension Lap Splice Formula (Class B = 1.3 * Ld)
    // Ld ~ (fy / (1.1 * sqrt(fc))) * dia
    const ld = (fy / (1.1 * Math.sqrt(fc))) * dia; // mm
    const lapLength = Math.round(1.3 * ld); // mm
    const tensionLapM = (lapLength / 1000).toFixed(2);

    if (document.getElementById('lapMetersOut')) document.getElementById('lapMetersOut').innerText = `${lapLength} mm (${tensionLapM} m)`;
    if (document.getElementById('lapRuleOut')) document.getElementById('lapRuleOut').innerText = `~${Math.round(lapLength / dia)}d (Class B Splice)`;
}

// 2. Equipment Fuel Consumption Estimator
function calcFuelCost() {
    const hours = parseFloat(document.getElementById('fuelHours')?.value) || 8; // Hours per day
    const powerHp = parseFloat(document.getElementById('fuelPower')?.value) || 180; // Equipment HP
    const fuelPriceLiter = parseFloat(document.getElementById('fuelPrice')?.value) || 0.65; // $ per liter

    // Average Diesel Consumption: ~0.15 Liters per HP-Hour under medium load
    const litersPerHour = powerHp * 0.15;
    const totalLiters = litersPerHour * hours;
    const totalFuelCostUsd = totalLiters * fuelPriceLiter;

    if (document.getElementById('fuelLitersOut')) document.getElementById('fuelLitersOut').innerText = `${Math.round(totalLiters)} Liters (${litersPerHour.toFixed(1)} L/hr)`;
    if (document.getElementById('fuelCostOut')) document.getElementById('fuelCostOut').innerText = `$${Math.round(totalFuelCostUsd).toLocaleString()}`;
}

// 3. Live Canvas Footing & Column Drawing
function drawFootingCanvas() {
    const canvas = document.getElementById('footingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Soil Line
    ctx.strokeStyle = "#64748B";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 50); ctx.lineTo(290, 50);
    ctx.stroke();

    // Soil Hatch
    ctx.fillStyle = "#334155";
    ctx.font = "10px sans-serif";
    ctx.fillText("Natural Ground Level (NGL)", 15, 42);

    // Draw Concrete Footing
    ctx.fillStyle = "#1E293B";
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 3;
    
    // Footing Box (Center 60 to 240)
    ctx.fillRect(70, 100, 160, 50);
    ctx.strokeRect(70, 100, 160, 50);

    // Column Box
    ctx.fillRect(130, 50, 40, 50);
    ctx.strokeRect(130, 50, 40, 50);

    // Rebar Lines (Bottom Mesh)
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 140); ctx.lineTo(220, 140); // Main bottom rebar
    ctx.stroke();

    // Rebar Hooks
    ctx.beginPath();
    ctx.moveTo(80, 140); ctx.lineTo(80, 120);
    ctx.moveTo(220, 140); ctx.lineTo(220, 120);
    ctx.stroke();

    // Text Annotations
    ctx.fillStyle = "#F8FAFC";
    ctx.font = "11px sans-serif";
    ctx.fillText("Footing Concrete", 110, 130);
    ctx.fillText("Column", 132, 80);
}

// Trigger canvas drawing on load
window.addEventListener('load', () => {
    setTimeout(drawFootingCanvas, 500);
});
