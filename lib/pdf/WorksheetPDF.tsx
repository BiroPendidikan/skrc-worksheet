import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  header: { textAlign: 'center', marginBottom: 20 },
  schoolName: { fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
  title: { fontSize: 14, fontWeight: 'bold', marginVertical: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  instructions: { marginBottom: 15, fontStyle: 'italic' },
  questionContainer: { marginBottom: 12 },
  questionNumber: { fontWeight: 'bold', marginBottom: 4 },
  answerLine: { borderBottom: '1 solid #000', height: 20, marginTop: 5, marginBottom: 10 },
  answerText: { fontSize: 10, color: 'green', marginTop: 2 },
});

interface WorksheetPDFProps {
  data: {
    title: string;
    subject: string;
    year: number;
    instructions: string;
    questions: any[];
  };
  includeAnswerScheme?: boolean;
  qrCodeDataUrl?: string;
}

const WorksheetPDF: React.FC<WorksheetPDFProps> = ({ data, includeAnswerScheme = false }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.schoolName}>SK RC KUBONG</Text>
        <Text>LEMBARAN KERJA PEMBELAJARAN DI RUMAH</Text>
        <Text>Nama: ____________________  Kelas: ______  Tarikh: ___________</Text>
        <Text style={styles.title}>{data.title}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text>Mata Pelajaran: {data.subject}</Text>
        <Text>Tahun: {data.year}</Text>
      </View>

      <Text style={styles.instructions}>{data.instructions}</Text>

      {data.questions.map((q: any, idx: number) => (
        <View key={idx} style={styles.questionContainer}>
          <Text style={styles.questionNumber}>{q.number}. {q.question}</Text>
          {q.type === 'multiple_choice' && q.options && (
            <View style={{ marginLeft: 20, marginTop: 4 }}>
              {q.options.map((opt: string, optIdx: number) => (
                <Text key={optIdx}>{String.fromCharCode(65 + optIdx)}. {opt}</Text>
              ))}
            </View>
          )}
          <View style={styles.answerLine} />
          {includeAnswerScheme && (
            <Text style={styles.answerText}>Jawapan: {q.answer}</Text>
          )}
        </View>
      ))}
    </Page>
  </Document>
);

export default WorksheetPDF;