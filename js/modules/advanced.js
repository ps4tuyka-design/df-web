// Rebar Cut Optimizer
function optimizeRebar() {
    const barLength = parseFloat(document.getElementById('stockBarLen')?.value) || 12; // Standard 12m bar
    const reqLen = parseFloat(document.getElementById('cutReqLen')?.value) || 3.8;
    const reqQty = parseInt(document.getElementById('cutReqQty')?.value) || 10;

    const piecesPerBar = Math.floor(barLength / reqLen);
    const totalBarsNeeded = Math.ceil(reqQty / piecesPerBar);
    const totalWastageMetres = (totalBarsNeeded * barLength) - (reqQty * reqLen);
    const wastagePercent = (totalWastageMetres / (totalBarsNeeded * barLength)) * 100;

    if (document.getElementById('optBarsNeeded')) document.getElementById('optBarsNeeded').innerText = totalBarsNeeded;
    if (document.getElementById('optPcsPerBar')) document.getElementById('optPcsPerBar').innerText = piecesPerBar;
    if (document.getElementById('optWastage')) document.getElementById('optWastage').innerText = `${totalWastageMetres.toFixed(2)} m (${wastagePercent.toFixed(1)}%)`;
}

// Soil SPT to Bearing Capacity Engine
function calcSPT() {
    const nValue = parseFloat(document.getElementById('sptNValue')?.value) || 15;
    // Empirical formula for footing q_allow ~ N / 0.08 (kPa) for B >= 1.2m
    const qAllowSpt = Math.round(nValue * 12.5);
    
    if (document.getElementById('sptQallow')) {
        document.getElementById('sptQallow').innerText = `${qAllowSpt} kPa (${(qAllowSpt/100).toFixed(2)} kg/cm²)`;
    }
}

// Machinery Productivity Engine
function calcMachinery() {
    const concVol = parseFloat(document.getElementById('fleetConcVol')?.value) || 150; // m3
    const hours = parseFloat(document.getElementById('fleetHours')?.value) || 6; // Hours allowed
    const mixerCap = parseFloat(document.getElementById('mixerCap')?.value) || 9; // m3 capacity

    const totalMixerTrips = Math.ceil(concVol / mixerCap);
    const tripsPerHour = (totalMixerTrips / hours).toFixed(1);

    if (document.getElementById('fleetTrips')) document.getElementById('fleetTrips').innerText = totalMixerTrips;
    if (document.getElementById('fleetRate')) document.getElementById('fleetRate').innerText = `${tripsPerHour} Trips / Hour`;
}

// Export BOQ directly to CSV / Excel
function exportToExcel() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Item Description,Quantity,Unit,Cost (USD)\n";
    csvContent += "Structural,Main Columns & Rafters,7.78,Ton,7387\n";
    csvContent += "Structural,Roof & Wall Purlins,5.18,Ton,4925\n";
    csvContent += "Foundation,Isolated Footings Concrete,12.8,m3,1088\n";
    csvContent += "QC Tests,Compaction FDT,96.5,%,PASS\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Engineering_Suite_BOQ.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
