const CurrencyEngine = {
    async init() {
        try {
            const res = await fetch('https://open.er-api.com/v6/latest/USD');
            const data = await res.json();
            if (data && data.rates && data.rates.IQD) {
                const live100Iqd = Math.round(data.rates.IQD * 100);
                const fxInput = document.getElementById('fxRate');
                if (fxInput) fxInput.value = live100Iqd;
                const statusEl = document.getElementById('fxStatus');
                if (statusEl) statusEl.innerText = '● Live Market FX Rate Updated';
                if (typeof recalculateAll === 'function') recalculateAll();
            }
        } catch(e) {
            console.log('Using baseline fallback FX rate');
        }
    },
    getFactor() {
        const fxInput = document.getElementById('fxRate');
        const fx = fxInput ? parseFloat(fxInput.value) : 153000;
        return (fx || 153000) / 100;
    }
};
