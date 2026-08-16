import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import WorksheetPDF from '@/lib/pdf/WorksheetPDF';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { worksheetData, includeAnswerScheme = false, qrCodeDataUrl } = body;

    if (!worksheetData) {
      return NextResponse.json({ error: 'Data worksheet diperlukan' }, { status: 400 });
    }

    const pdfStream = await renderToStream(
      <WorksheetPDF
        data={worksheetData}
        includeAnswerScheme={includeAnswerScheme}
        qrCodeDataUrl={qrCodeDataUrl || null}
      />
    );

    return new NextResponse(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="worksheet-${Date.now()}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}