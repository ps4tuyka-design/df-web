// UI/UX Enhancements: Quick Unit Converter, Toast Notifications & Printable Company Header

// 1. Toast Notification Engine
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:8px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#10B981' : (type === 'error' ? '#EF4444' : '#2563EB');
    toast.style.cssText = `background:${bgColor}; color:#FFF; padding:10px 16px; border-radius:8px; font-size:12px; font-weight:700; box-shadow:0 4px 12px rgba(0,0,0,0.2); transition:all 0.3s ease; opacity:0; transform:translateY(10px);`;
    toast.innerText = message;

    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 2. Quick Floating Unit Converter
function convertUnit() {
    const val = parseFloat(document.getElementById('unitVal')?.value) || 0;
    const type = document.getElementById('unitType')?.value;
    let res = 0;
    let label = '';

    if (type === 'm_ft') { res = val * 3.28084; label = 'Feet (ft)'; }
    else if (type === 'ft_m') { res = val / 3.28084; label = 'Meters (m)'; }
    else if (type === 'psi_bar') { res = val * 0.0689476; label = 'Bar'; }
    else if (type === 'bar_psi') { res = val / 0.0689476; label = 'PSI'; }
    else if (type === 'kg_lb') { res = val * 2.20462; label = 'Pounds (lbs)'; }

    if (document.getElementById('unitOut')) {
        document.getElementById('unitOut').innerText = `${res.toFixed(2)} ${label}`;
    }
}

// Global Export Toast Override Trigger
window.addEventListener('load', () => {
    showToast('DF Engineering Workstation Loaded Successfully', 'info');
});
