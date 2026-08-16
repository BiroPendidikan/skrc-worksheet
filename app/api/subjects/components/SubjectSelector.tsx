'use client';

import { useState, useEffect } from 'react';

interface Subject {
  id: string;
  name: string;
  code: string;
}

export default function SubjectSelector({
  selectedYear,
  curriculumId,
  onSelect,
}: {
  selectedYear: number | null;
  curriculumId: string;
  onSelect: (subject: Subject | null) => void;
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    console.log('Fetching subjects for year', selectedYear, 'curriculumId', curriculumId);
    if (!selectedYear || !curriculumId) {
      setSubjects([]);
      return;
    }
    setLoading(true);
    fetch(`/api/subjects?year=${selectedYear}&curriculum_id=${curriculumId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ralat rangkaian');
        return res.json();
      })
      .then((data) => {
        console.log('Data subjek diterima:', data);
        setSubjects(data.subjects || []);
      })
      .catch((err) => {
        console.error('Gagal memuat subjek:', err);
        setSubjects([]);
      })
      .finally(() => setLoading(false));
  }, [selectedYear, curriculumId]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subject = subjects.find((s) => s.id === e.target.value) || null;
    setSelected(e.target.value);
    onSelect(subject);
  };

  if (!selectedYear) {
    return (
      <div>
        <label className="block text-sm font-medium">Mata Pelajaran</label>
        <p className="text-sm text-gray-500 mt-1">Pilih tahun terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium">Mata Pelajaran</label>
      <select
        value={selected}
        onChange={handleChange}
        disabled={loading}
        className="mt-1 w-full p-2 border rounded disabled:opacity-50"
      >
        <option value="">{loading ? 'Memuatkan...' : 'Pilih Mata Pelajaran'}</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.code})
          </option>
        ))}
      </select>
    </div>
  );
}