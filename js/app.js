document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Engines
    CurrencyEngine.init();
    ProjectEngine.init();

    // 2. Setup Navigation Routing
    const navItems = document.querySelectorAll('.nav-list .nav-item');
    const tabModules = document.querySelectorAll('.tab-module');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');

            navItems.forEach(n => n.classList.remove('active'));
            tabModules.forEach(m => {
                m.classList.remove('active');
                m.style.display = 'none';
            });

            item.classList.add('active');
            const targetTab = document.getElementById(`tab-${tabId}`);
            if (targetTab) {
                targetTab.classList.add('active');
                targetTab.style.display = 'block';
            }

            recalculateAll();
        });
    });

    // 3. Attach Live Input Calculation Handlers
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', recalculateAll);
    });

    // 4. Attach CAD Export Button Listener
    const btnDxf = document.getElementById('btnExportDXF');
    if (btnDxf) {
        btnDxf.addEventListener('click', () => {
            ExportEngine.exportDXF();
        });
    }

    recalculateAll();
});

function recalculateAll() {
    if (typeof calcShed === 'function') calcShed();
    if (typeof calcConcrete === 'function') calcConcrete();
    if (typeof calcRoads === 'function') calcRoads();
    if (typeof calcSurvey === 'function') calcSurvey();
    if (typeof updateOffer === 'function') updateOffer();
}
