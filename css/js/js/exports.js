const ExportEngine = {
    exportDXF() {
        const W = document.getElementById('shedW')?.value || 15;
        const H = document.getElementById('shedH')?.value || 6;
        let dxf = "0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n";
        dxf += `0\nLINE\n8\nCOLUMNS\n10\n0.0\n20\n0.0\n11\n0.0\n21\n${H}\n`;
        dxf += `0\nLINE\n8\nCOLUMNS\n10\n${W}\n20\n0.0\n11\n${W}\n21\n${H}\n`;
        dxf += "0\nENDSEC\n0\nEOF\n";

        const blob = new Blob([dxf], { type: 'application/dxf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Structural_Frame_${W}m.dxf`;
        link.click();
    },

    generatePDF(titleName) {
        const activeTab = document.querySelector('.tab-module.active');
        if (!activeTab) return;

        const printWin = window.open('', '_blank');
        const fxVal = document.getElementById('fxRate')?.value || '153000';
        const projTitle = document.getElementById('currentProjectTitle')?.innerText || 'Civil Engineering Suite';
        const methodText = document.getElementById('shedStructuralCheck')?.innerText || 'Standard Method Statement Execution Plan.';

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${titleName} - Report</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #0F172A; }
                    .header { border-bottom: 3px solid #2563EB; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
                    .title { font-size: 20px; font-weight: 800; }
                    .meta { background: #F8FAFC; padding: 12px; border: 1px solid #CBD5E1; margin-bottom: 24px; font-size: 12px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                    th, td { padding: 10px; border: 1px solid #CBD5E1; font-size: 12px; text-align: left; }
                    th { background: #0F172A; color: #FFF; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="title">${projTitle}</div>
                        <div>Official Data Sheet — ${titleName}</div>
                    </div>
                    <div style="font-size: 11px;">
                        <div>Date: ${new Date().toLocaleDateString()}</div>
                        <div>FX Rate: ${fxVal} IQD / $100</div>
                    </div>
                </div>
                <div class="meta"><b>SPECIFICATIONS & METHOD STATEMENT:</b><br>${methodText}</div>
                <h3>Bill of Quantities (BOQ):</h3>
                ${activeTab.querySelector('.results-box') ? activeTab.querySelector('.results-box').innerHTML : ''}
                <script>window.onload = function() { window.print(); }<\/script>
            </body>
            </html>
        `;

        printWin.document.write(html);
        printWin.document.close();
    }
};
