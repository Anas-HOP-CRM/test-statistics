import { useState } from 'react';
import { Download, CheckCircle } from 'lucide-react';
import reportData from './reportData';

const BugReportGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const container = document.querySelector('.print-container');
      if (!container) throw new Error('Report container not found');

      // Clone container and remove any elements marked .no-print
      const clone = container.cloneNode(true);
      clone.querySelectorAll && clone.querySelectorAll('.no-print').forEach(n => n.remove());

      // Reduce padding/spacing that can cause an extra blank PDF page
      clone.style.padding = '0';
      clone.style.boxShadow = 'none';

      // Wrap clone in a temporary element to ensure a proper root
      const wrapper = document.createElement('div');
      wrapper.style.background = '#ffffff';
      wrapper.style.padding = '0';
      wrapper.appendChild(clone);

      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const filename = `bug-report-${new Date().toISOString().slice(0,10)}.pdf`;
      const opt = {
        margin: 8,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      await html2pdf().set(opt).from(wrapper).save();
    } catch (err) {
      console.error('PDF generation failed, falling back to print()', err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-container { box-shadow: none !important; padding: 20px !important; }
          @page { margin: 1cm; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Download Button */}
        <div className="no-print mb-6 flex justify-end">
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <Download size={20} />
            {isGenerating ? 'Génération...' : 'Télécharger en PDF'}
          </button>
        </div>

        {/* Report Container */}
        <div className="print-container bg-white rounded-lg shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="border-b-4 border-orange-500 pb-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {reportData.title}
            </h1>
            <p className="text-gray-600 text-lg">{reportData.subtitle}</p>
            <p className="text-gray-400 text-sm mt-2">Généré le {currentDate}</p>
          </div>

          {/* Sections */}
          {reportData.sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                {section.title}
              </h2>

              {section.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="bg-gray-50 border-l-4 border-orange-500 p-6 mb-6 rounded-r hover:shadow-md transition-shadow"
                >
                  {/* Bug Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">🟠</span>
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="ml-9 text-gray-700 mb-3">{item.description}</p>
                  )}

                  {/* Sub Items */}
                  {item.subItems && item.subItems.length > 0 && (
                    <ul className="ml-9 space-y-2 mb-3">
                      {item.subItems.map((subItem, subIdx) => (
                        <li key={subIdx} className="text-gray-700 flex items-start gap-2">
                          <span className="text-orange-500 font-bold mt-1">•</span>
                          <span className="flex-1">{subItem}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Reason(s) */}
                  {(item.reason || item.reasons) && (
                    <div className="ml-9 bg-white border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-blue-600 font-semibold text-sm mb-2">RAISON</p>
                      {item.reasons ? (
                        item.reasons.map((r, ridx) => (
                          <p key={ridx} className="text-gray-700 text-sm mb-2">
                            {r}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-700 text-sm">{item.reason}</p>
                      )}
                    </div>
                  )}

                  {/* Expected Behavior */}
                  {item.expectedBehavior && (
                    <div className="ml-9 bg-green-50 border-l-4 border-green-500 p-4 rounded mt-3">
                      <p className="text-green-700 font-semibold text-sm mb-2 flex items-center gap-2">
                        <CheckCircle size={16} />
                        COMPORTEMENT ATTENDU
                      </p>
                      <ul className="space-y-1">
                        {item.expectedBehavior.map((behavior, behaviorIdx) => (
                          <li key={behaviorIdx} className="text-gray-700 text-sm ml-4 list-disc">
                            {behavior}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BugReportGenerator;
