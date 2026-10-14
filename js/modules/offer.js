function updateOffer() {
    const proj = document.getElementById('projName')?.value || '';
    const client = document.getElementById('clientName')?.value || '';
    const offerEl = document.getElementById('offerContent');
    if (offerEl) {
        offerEl.innerText = 
            `1. PROJECT OVERVIEW:\n- Title: ${proj}\n- Supervising Authority: ${client}\n\n2. METHOD STATEMENT & EXECUTION:\n- Site Topographic Survey using calibrated Total Station.\n- Excavation & Soil Backfilling compacted to 95% Modified Proctor Density.\n- Reinforced Concrete Footing Pouring using C30/37 Sulfate Resisting Cement.\n- Structural Steel Frame Erection with Torque-Controlled High-Strength Anchor Bolts.\n- Quality Control Inspection & Final HSE Handover Checklist.`;
    }
}
