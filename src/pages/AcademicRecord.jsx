import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEO from '../components/SEO';
import { FiDownload } from 'react-icons/fi';
import FadeIn from '../components/FadeIn';

import academicRecordMd from '../content/academic-record.md?raw';

export default function AcademicRecord() {
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'Kavishka_Dulshan_Academic_Record';

    // Use a small timeout to allow the browser to update the document title before opening the print dialog
    setTimeout(() => {
      window.print();
      // Restore title after print dialog closes
      document.title = originalTitle;
    }, 50);
  };

  return (
    <div className="bg-white min-h-screen pt-10 pb-16 max-w-4xl mx-auto px-6 sm:px-8 print:p-0 print:m-0 print-exact">
      <SEO
        title="Academic Record"
        description="Kavishka Dulshan's academic transcript and modules."
        path="/academic-record"
      />
      <style>{`
        @media print {
          @page { size: A4; margin: 20mm; }
          body {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white;
          }
          .print\\\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      <FadeIn>
        <div className="flex justify-between items-center mb-8 print:hidden">
          <h1 className="font-serif text-3xl font-medium text-gray-900">Academic Record</h1>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full border border-gray-900 text-gray-900 px-5 py-2 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors"
          >
            <FiDownload /> Export PDF
          </button>
        </div>

        <div className="prose prose-gray max-w-none 
                        prose-headings:font-serif prose-headings:text-gray-900 prose-headings:font-medium
                        prose-table:w-full prose-table:border-collapse prose-table:mt-2
                        prose-th:bg-gray-50 prose-th:p-3 prose-th:text-left prose-th:border-b-2 prose-th:border-gray-200
                        prose-td:p-3 prose-td:border-b prose-td:border-gray-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {academicRecordMd}
          </ReactMarkdown>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 italic print:mt-8 print:pt-4">
          <p>
            <b className='font-medium text-gray-900'>Academic Record Disclaimer:</b>
            <br />
            The following tables outline my academic performance and module results. While accurate to my current student records, this document is an unofficial, self-reported summary and is not a formal transcript officially issued by NSBM Green University. Official documentation can be supplied for employment screening or background checks if required.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
