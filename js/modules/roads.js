function calcRoads() {
    const L = parseFloat(document.getElementById('roadL')?.value) || 0;
    const W = parseFloat(document.getElementById('roadW')?.value) || 0;
    const T = (parseFloat(document.getElementById('subbaseT')?.value) || 0) / 100;
    const pSub = parseFloat(document.getElementById('subbaseP')?.value) || 0;
    const factor = CurrencyEngine.getFactor();

    const vol = L * W * T * 1.25;
    const subUsd = vol * pSub;
    const trucks = Math.ceil(vol / 18);

    if (document.getElementById('subVol')) document.getElementById('subVol').innerText = Math.round(vol).toLocaleString();
    if (document.getElementById('subUsd')) document.getElementById('subUsd').innerText = '$' + Math.round(subUsd).toLocaleString();
    if (document.getElementById('subIqd')) document.getElementById('subIqd').innerText = Math.round(subUsd * factor).toLocaleString() + ' IQD';
    if (document.getElementById('trucksCount')) document.getElementById('trucksCount').innerText = trucks;
}
