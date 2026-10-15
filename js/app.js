// Application Initializer & Auto-Calculator
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Navigation Listener
    const navButtons = document.querySelectorAll('.nav-item button');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const navItem = btn.parentElement;
            const targetTab = navItem.getAttribute('data-tab');

            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.tab-module').forEach(mod => mod.style.display = 'none');

            navItem.classList.add('active');
            const activeModule = document.getElementById(`tab-${targetTab}`);
            if (activeModule) {
                activeModule.style.display = 'block';
            }
        });
    });

    // 2. Trigger Initial Calculations on Load
    if (typeof calcShed === 'function') calcShed();
    if (typeof calcFoundation === 'function') calcFoundation();
    if (typeof calcHydraulics === 'function') calcHydraulics();
    if (typeof generateSCurve === 'function') generateSCurve();
    if (typeof calcConcrete === 'function') calcConcrete();
    if (typeof calcRoads === 'function') calcRoads();
    if (typeof calcSurvey === 'function') calcSurvey();
    if (typeof generateOffer === 'function') generateOffer();
    if (typeof calcSPT === 'function') calcSPT();
    if (typeof calcFDT === 'function') calcFDT();
    if (typeof checkDeflection === 'function') checkDeflection();
    if (typeof classifySoil === 'function') classifySoil();
    if (typeof calcPanels === 'function') calcPanels();
    if (typeof calcRebarDetails === 'function') calcRebarDetails();
    if (typeof calcMixDesign === 'function') calcMixDesign();
    if (typeof calcFormwork === 'function') calcFormwork();
    if (typeof calcMasonry === 'function') calcMasonry();
    if (typeof optimizeRebar === 'function') optimizeRebar();
    if (typeof calcMachinery === 'function') calcMachinery();
    if (typeof calcLapSplice === 'function') calcLapSplice();
    if (typeof calcFuelCost === 'function') calcFuelCost();

    // 3. Auto Canvas Render
    if (typeof drawFootingCanvas === 'function') {
        setTimeout(drawFootingCanvas, 200);
    }
});
