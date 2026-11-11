/**
 * ETHIO AI HUB - Document Writer
 * Professional workspace for generating official Ethiopian letters,
 * business reports, proposals, and exporting to genuine Word (.doc/.docx), CSV, and TXT.
 */

window.EthioTools_DocumentWriter = (function() {
  const templates = [
    {
      id: 'job-app',
      name: 'ይፋዊ የስራ ማመልከቻ (Job Application)',
      prompt: 'Write an official Ethiopian job application letter in Amharic addressed to a government or private organization.'
    },
    {
      id: 'resignation',
      name: 'የስራ መልቀቂያ ደብዳቤ (Resignation Letter)',
      prompt: 'Write a formal resignation letter in Amharic complying with Ethiopian Labor proclamation notice periods.'
    },
    {
      id: 'power-of-attorney',
      name: 'የውክልና ደብዳቤ ረቂቅ (Power of Attorney)',
      prompt: 'Draft an Ethiopian legal power of attorney (የውክልና ማስረጃ) agreement outline.'
    },
    {
      id: 'business-proposal',
      name: 'የቢዝነስ ፕሮፖዛል (Business Proposal)',
      prompt: 'Draft an executive business project proposal with background, objectives, budget in ETB, and timeline.'
    },
    {
      id: 'meeting-minutes',
      name: 'የስብሰባ ቃለ-ጉባኤ (Meeting Minutes)',
      prompt: 'Draft official meeting minutes (ቃለ-ጉባኤ) with agenda items, attendees, and agreed resolutions.'
    }
  ];

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;
    const incomingText = sessionStorage.getItem('ethio_doc_transfer') || '';
    if (incomingText) {
      sessionStorage.removeItem('ethio_doc_transfer');
    }

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #fef3c7; color: #d97706;">
            📝
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navDocumentWriter')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              ይፋዊ ደብዳቤዎች፣ ሪፖርቶች፣ የሰዋሰው እርማት እና የ Word (DOCX)/CSV ሰነዶች ማመንጫ
            </p>
          </div>
        </div>
      </div>

      <div class="doc-workspace">
        
        <!-- Sidebar Controls & Templates -->
        <div class="doc-sidebar">
          
          <div class="card">
            <h3 style="font-size: 0.95rem; margin-bottom: 10px;">ዝግጁ የደብዳቤ ሞዴሎች (Templates)</h3>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${templates.map(tmpl => `
                <button class="btn btn-secondary btn-sm template-select-btn" data-prompt="${tmpl.prompt}" style="justify-content: flex-start; text-align: left;">
                  <span>📄</span> <span>${tmpl.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="card">
            <h3 style="font-size: 0.95rem; margin-bottom: 10px;">በ AI ጻፍ ወይም አሻሽል</h3>
            <div class="form-group">
              <label class="form-label" style="font-size: 0.8rem;">የሰነዱ ዋና አላማ ወይም የሚያሻሽሉት ጽሁፍ:</label>
              <textarea id="doc-ai-prompt" rows="3" placeholder="ለምሳሌ፡ የመኪና ኪራይ ውል ስምምነት አዘጋጅልኝ..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size: 0.8rem;">የድርጊት አይነት</label>
              <select id="doc-ai-action">
                <option value="generate">አዲስ ሰነድ ጻፍ (Write New)</option>
                <option value="grammar">ሰዋሰውና አጻጻፍ አስተካክል (Grammar & Polish)</option>
                <option value="summarize">አሳጥርና ዋና ነጥቦችን አውጣ (Summarize)</option>
                <option value="csv">የሰንጠረዥ ዳታ አዘጋጅ (Generate CSV)</option>
              </select>
            </div>
            <button id="btn-doc-ai-run" class="btn btn-primary" style="width: 100%;">
              <span>⚡</span> <span>በ AI አዘጋጅ</span>
            </button>
          </div>

        </div>

        <!-- Editor & Document Workspace -->
        <div class="card doc-editor-card">
          
          <div class="doc-toolbar">
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-main);">
              የሰነድ ማረሚያ (Editable Live Document Preview)
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button id="btn-save-doc" class="btn btn-secondary btn-sm" title="${t('save')}">
                <span>💾</span> <span>${t('save')}</span>
              </button>
              <button id="btn-export-docx" class="btn btn-secondary btn-sm" title="Microsoft Word Compatible Document">
                <span>📄</span> <span>Word (.doc)</span>
              </button>
              <button id="btn-export-csv" class="btn btn-secondary btn-sm" title="Spreadsheet CSV">
                <span>📊</span> <span>CSV (.csv)</span>
              </button>
              <button id="btn-export-txt" class="btn btn-secondary btn-sm" title="Text File">
                <span>📑</span> <span>TXT</span>
              </button>
              <button id="btn-print-doc" class="btn btn-secondary btn-sm" title="Print Document">
                <span>🖨️</span> <span>አትም (Print)</span>
              </button>
            </div>
          </div>

          <textarea id="doc-main-editor" class="doc-content-area" placeholder="ሰነድዎ እዚህ ይዘጋጃል። በቀጥታ መጻፍ፣ ማረም ወይም ከግራ በኩል በ AI ማመንጨት ይችላሉ...">${incomingText}</textarea>
        </div>

      </div>
    `;

    // Handlers
    const editor = document.getElementById('doc-main-editor');
    const runBtn = document.getElementById('btn-doc-ai-run');
    const promptInput = document.getElementById('doc-ai-prompt');
    const actionSelect = document.getElementById('doc-ai-action');

    // Template clicks
    container.querySelectorAll('.template-select-btn').forEach(b => {
      b.addEventListener('click', () => {
        promptInput.value = b.getAttribute('data-prompt');
        actionSelect.value = 'generate';
        runDocAI();
      });
    });

    runBtn.addEventListener('click', runDocAI);

    async function runDocAI() {
      const p = promptInput.value.trim();
      const action = actionSelect.value;
      const currentContent = editor.value.trim();

      if (!p && !currentContent) {
        alert("እባክዎ አላማውን ወይም የሚስተካከለውን ጽሁፍ ያስገቡ");
        return;
      }

      runBtn.disabled = true;
      runBtn.innerHTML = `<span class="spinner"></span> በማዘጋጀት ላይ...`;

      try {
        let fullPrompt = "";
        if (action === 'generate') {
          fullPrompt = `Generate a complete, high-standard official document in Amharic for: ${p}. Use standard Ethiopian official letterhead formatting with Date, Reference Number placeholders, addressee, body, and signature blocks.`;
        } else if (action === 'grammar') {
          fullPrompt = `Review and correct the grammar, flow, spelling, and professional tone of the following Amharic text:\n\n${currentContent || p}`;
        } else if (action === 'summarize') {
          fullPrompt = `Summarize the following document into key executive bullet points in Amharic:\n\n${currentContent || p}`;
        } else if (action === 'csv') {
          fullPrompt = `Generate a valid comma-separated values (CSV) table with headers in Ethiopian context for: ${p || currentContent}. Output ONLY the raw CSV text.`;
        }

        const res = await window.EthioAPI.callAI('document-writer', fullPrompt);
        editor.value = res;
      } catch (err) {
        alert(err.message);
      } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = `<span>⚡</span> <span>በ AI አዘጋጅ</span>`;
      }
    }

    // Save
    document.getElementById('btn-save-doc').addEventListener('click', async () => {
      const content = editor.value.trim();
      if (!content) return;
      await window.EthioFavorites.saveItem('document', {
        title: content.split('\n')[0].slice(0, 40) || 'Official Document',
        content: content
      });
    });

    // Genuine Microsoft Word (.doc) OpenXML / HTML Blob Export
    document.getElementById('btn-export-docx').addEventListener('click', () => {
      const content = editor.value;
      if (!content) {
        alert("ሰነዱ ባዶ ነው");
        return;
      }

      // True Word HTML wrapper formatted specifically for MS Word and Google Docs
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>ETHIO AI HUB Document</title>
          <!--[if gte mso 9]>
          <xml>
          <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            body { font-family: 'Nyala', 'Abyssinica SIL', 'Segoe UI', Calibri, sans-serif; font-size: 12pt; line-height: 1.6; color: #000; }
            p { margin-bottom: 12pt; }
          </style>
        </head>
        <body>
          ${content.split('\n').map(l => `<p>${escapeHtml(l) || '&nbsp;'}</p>`).join('')}
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
      downloadBlob(blob, `ethio_document_${Date.now()}.doc`);
    });

    // CSV Export
    document.getElementById('btn-export-csv').addEventListener('click', () => {
      const content = editor.value;
      if (!content) return;
      const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, `ethio_data_${Date.now()}.csv`);
    });

    // TXT Export
    document.getElementById('btn-export-txt').addEventListener('click', () => {
      const content = editor.value;
      if (!content) return;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      downloadBlob(blob, `ethio_document_${Date.now()}.txt`);
    });

    // Print
    document.getElementById('btn-print-doc').addEventListener('click', () => {
      const content = editor.value;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Document - ETHIO AI HUB</title>
              <style>
                body { font-family: sans-serif; padding: 40px; font-size: 14px; line-height: 1.6; }
                pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; }
              </style>
            </head>
            <body>
              <pre>${escapeHtml(content)}</pre>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  return {
    render: render
  };
})();
