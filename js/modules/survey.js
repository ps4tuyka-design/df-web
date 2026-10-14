function calcSurvey() {
    const bm = parseFloat(document.getElementById('bmVal')?.value) || 0;
    const bs = parseFloat(document.getElementById('bsVal')?.value) || 0;
    const fs = parseFloat(document.getElementById('fsVal')?.value) || 0;

    const hi = bm + bs;
    const rl = hi - fs;

    if (document.getElementById('hiVal')) document.getElementById('hiVal').innerText = hi.toFixed(2);
    if (document.getElementById('rlVal')) document.getElementById('rlVal').innerText = rl.toFixed(2);
}
