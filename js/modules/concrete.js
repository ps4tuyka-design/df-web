function calcConcrete() {
    const L = parseFloat(document.getElementById('concL')?.value) || 0;
    const W = parseFloat(document.getElementById('concW')?.value) || 0;
    const T = (parseFloat(document.getElementById('concT')?.value) || 0) / 100;
    const pConc = parseFloat(document.getElementById('concP')?.value) || 0;
    const pRebar = parseFloat(document.getElementById('rebarP')?.value) || 0;
    const factor = CurrencyEngine.getFactor();

    const vol = L * W * T;
    const mainRebar = vol * 0.085;
    const secRebar = vol * 0.025;

    const concUsd = vol * pConc;
    const mainUsd = mainRebar * pRebar;
    const secUsd = secRebar * pRebar;

    if (document.getElementById('concVol')) document.getElementById('concVol').innerText = vol.toFixed(1);
    if (document.getElementById('concCostUsd')) document.getElementById('concCostUsd').innerText = '$' + Math.round(concUsd).toLocaleString();
    if (document.getElementById('concCostIqd')) document.getElementById('concCostIqd').innerText = Math.round(concUsd * factor).toLocaleString() + ' IQD';

    if (document.getElementById('rebarMainTon')) document.getElementById('rebarMainTon').innerText = mainRebar.toFixed(2);
    if (document.getElementById('rebarMainUsd')) document.getElementById('rebarMainUsd').innerText = '$' + Math.round(mainUsd).toLocaleString();
    if (document.getElementById('rebarMainIqd')) document.getElementById('rebarMainIqd').innerText = Math.round(mainUsd * factor).toLocaleString() + ' IQD';

    if (document.getElementById('rebarSecTon')) document.getElementById('rebarSecTon').innerText = secRebar.toFixed(2);
    if (document.getElementById('rebarSecUsd')) document.getElementById('rebarSecUsd').innerText = '$' + Math.round(secUsd).toLocaleString();
    if (document.getElementById('rebarSecIqd')) document.getElementById('rebarSecIqd').innerText = Math.round(secUsd * factor).toLocaleString() + ' IQD';
}
