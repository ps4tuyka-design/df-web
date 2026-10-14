function calcShed() {
    const L = parseFloat(document.getElementById('shedL')?.value) || 0;
    const W = parseFloat(document.getElementById('shedW')?.value) || 0;
    const H = parseFloat(document.getElementById('shedH')?.value) || 0;
    const bay = parseFloat(document.getElementById('baySpacing')?.value) || 6;
    const pSteel = parseFloat(document.getElementById('steelP')?.value) || 0;
    const pPanel = parseFloat(document.getElementById('panelP')?.value) || 0;
    const factor = CurrencyEngine.getFactor();

    const area = L * W;
    const totalSteelTon = (area * 36) / 1000;

    let recProfile = "IPE 270 / HEA 180";
    if (W > 18) recProfile = "IPE 360 / HEA 240";
    else if (W > 12) recProfile = "IPE 300 / HEA 200";

    const secColEl = document.getElementById('secCol');
    if (secColEl) secColEl.innerText = recProfile;

    const colTon = totalSteelTon * 0.48;
    const purTon = totalSteelTon * 0.32;
    const brcTon = totalSteelTon * 0.12;
    const ancTon = totalSteelTon * 0.08;
    const panelM2 = (area * 1.05) + (2 * (L + W) * H);

    const colUsd = colTon * pSteel;
    const purUsd = purTon * pSteel;
    const brcUsd = brcTon * pSteel;
    const ancUsd = ancTon * pSteel * 1.3;
    const panUsd = panelM2 * pPanel;
    const totalUsd = colUsd + purUsd + brcUsd + ancUsd + panUsd;

    if (document.getElementById('mColQty')) document.getElementById('mColQty').innerText = colTon.toFixed(2);
    if (document.getElementById('mColUsd')) document.getElementById('mColUsd').innerText = '$' + Math.round(colUsd).toLocaleString();
    if (document.getElementById('mColIqd')) document.getElementById('mColIqd').innerText = Math.round(colUsd * factor).toLocaleString() + ' IQD';

    if (document.getElementById('mPurQty')) document.getElementById('mPurQty').innerText = purTon.toFixed(2);
    if (document.getElementById('mPurUsd')) document.getElementById('mPurUsd').innerText = '$' + Math.round(purUsd).toLocaleString();
    if (document.getElementById('mPurIqd')) document.getElementById('mPurIqd').innerText = Math.round(purUsd * factor).toLocaleString() + ' IQD';

    if (document.getElementById('mBrcQty')) document.getElementById('mBrcQty').innerText = brcTon.toFixed(2);
    if (document.getElementById('mBrcUsd')) document.getElementById('mBrcUsd').innerText = '$' + Math.round(brcUsd).toLocaleString();
    if (document.getElementById('mBrcIqd')) document.getElementById('mBrcIqd').innerText = Math.round(brcUsd * factor).toLocaleString() + ' IQD';

    if (document.getElementById('mAncQty')) document.getElementById('mAncQty').innerText = Math.ceil(L / (bay || 6)) * 2;
    if (document.getElementById('mAncUsd')) document.getElementById('mAncUsd').innerText = '$' + Math.round(ancUsd).toLocaleString();
    if (document.getElementById('mAncIqd')) document.getElementById('mAncIqd').innerText = Math.round(ancUsd * factor).toLocaleString() + ' IQD';

    if (document.getElementById('mPanQty')) document.getElementById('mPanQty').innerText = Math.round(panelM2).toLocaleString();
    if (document.getElementById('mPanUsd')) document.getElementById('mPanUsd').innerText = '$' + Math.round(panUsd).toLocaleString();
    if (document.getElementById('mPanIqd')) document.getElementById('mPanIqd').innerText = Math.round(panUsd * factor).toLocaleString() + ' IQD';

    if (document.getElementById('shedTotalUsd')) document.getElementById('shedTotalUsd').innerText = '$' + Math.round(totalUsd).toLocaleString();
    if (document.getElementById('shedTotalIqd')) document.getElementById('shedTotalIqd').innerText = Math.round(totalUsd * factor).toLocaleString() + ' IQD';

    const checkEl = document.getElementById('shedStructuralCheck');
    if (checkEl) {
        const footSize = (W * 0.12).toFixed(1);
        checkEl.innerText = `Method Statement: Excavate footings (${footSize}m x ${footSize}m x 1.2m). Cast C30 SRC concrete base. Erect ${recProfile} columns at ${bay}m spacing. Install C200 purlins & 50mm Sandwich Panels.`;
    }
}
