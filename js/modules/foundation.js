function calcFoundation() {
    const qAllow = parseFloat(document.getElementById('ftgQallow')?.value) || 120;
    const axialLoad = parseFloat(document.getElementById('ftgLoad')?.value) || 250;
    const pConc = parseFloat(document.getElementById('ftgConcP')?.value) || 85;
    const pRebar = parseFloat(document.getElementById('ftgRebarP')?.value) || 900;
    const factor = CurrencyEngine.getFactor();

    const reqArea = (axialLoad / qAllow) * 1.15;
    let side = Math.sqrt(reqArea);
    if (side < 1.0) side = 1.0;
    side = Math.ceil(side * 10) / 10;

    const thickness = side >= 2.0 ? 0.6 : (side >= 1.5 ? 0.5 : 0.4);
    const concreteVol = side * side * thickness;
    const rebarWeightTon = (concreteVol * 75) / 1000;
    const excSide = side + 0.6;
    const excVol = excSide * excSide * 1.5;

    const concUsd = concreteVol * pConc;
    const rebarUsd = rebarWeightTon * pRebar;
    const totalUsd = concUsd + rebarUsd;

    if (document.getElementById('ftgDim')) document.getElementById('ftgDim').innerText = `${side.toFixed(1)}m x ${side.toFixed(1)}m x ${thickness.toFixed(2)}m`;
    if (document.getElementById('ftgConcVol')) document.getElementById('ftgConcVol').innerText = concreteVol.toFixed(2);
    if (document.getElementById('ftgExcVol')) document.getElementById('ftgExcVol').innerText = excVol.toFixed(1);
    if (document.getElementById('ftgRebarTon')) document.getElementById('ftgRebarTon').innerText = rebarWeightTon.toFixed(2);
    if (document.getElementById('ftgTotalUsd')) document.getElementById('ftgTotalUsd').innerText = '$' + Math.round(totalUsd).toLocaleString();
    if (document.getElementById('ftgTotalIqd')) document.getElementById('ftgTotalIqd').innerText = Math.round(totalUsd * factor).toLocaleString() + ' IQD';
}

function calcFDT() {
    const wetDensity = parseFloat(document.getElementById('fdtWetDensity')?.value) || 0;
    const moisture = parseFloat(document.getElementById('fdtMoisture')?.value) || 0;
    const maxDryDensity = parseFloat(document.getElementById('fdtMDD')?.value) || 2.15;

    const dryDensity = wetDensity / (1 + (moisture / 100));
    const compactionDegree = (dryDensity / maxDryDensity) * 100;

    const resEl = document.getElementById('fdtResult');
    if (resEl) {
        if (compactionDegree >= 95) {
            resEl.innerHTML = `<span style="color:#10B981; font-weight:bold;">PASS (${compactionDegree.toFixed(1)}%) - Exceeds 95% Compaction Standard</span>`;
        } else {
            resEl.innerHTML = `<span style="color:#EF4444; font-weight:bold;">FAIL (${compactionDegree.toFixed(1)}%) - Below Required 95% MDD</span>`;
        }
    }
}
