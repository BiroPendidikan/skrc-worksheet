'use client';

import { useState, useEffect } from 'react';

interface Subject {
  id: string;
  name: string;
  code: string;
}

// Data subjek KSSR Semakan 2017 mengikut tahun
const SUBJECTS_BY_YEAR: Record<number, Subject[]> = {
  1: [
    { id: 'bm1', name: 'Bahasa Melayu', code: 'BM' },
    { id: 'bi1', name: 'Bahasa Inggeris', code: 'BI' },
    { id: 'mt1', name: 'Matematik', code: 'MT' },
    { id: 'sn1', name: 'Sains', code: 'SN' },
    { id: 'pi1', name: 'Pendidikan Islam', code: 'PI' },
    { id: 'pm1', name: 'Pendidikan Moral', code: 'PM' },
    { id: 'pjk1', name: 'Pendidikan Jasmani dan Kesihatan', code: 'PJK' },
    { id: 'psv1', name: 'Pendidikan Seni Visual', code: 'PSV' },
    { id: 'pmz1', name: 'Pendidikan Muzik', code: 'PMZ' },
  ],
  2: [
    { id: 'bm2', name: 'Bahasa Melayu', code: 'BM' },
    { id: 'bi2', name: 'Bahasa Inggeris', code: 'BI' },
    { id: 'mt2', name: 'Matematik', code: 'MT' },
    { id: 'sn2', name: 'Sains', code: 'SN' },
    { id: 'pi2', name: 'Pendidikan Islam', code: 'PI' },
    { id: 'pm2', name: 'Pendidikan Moral', code: 'PM' },
    { id: 'pjk2', name: 'Pendidikan Jasmani dan Kesihatan', code: 'PJK' },
    { id: 'psv2', name: 'Pendidikan Seni Visual', code: 'PSV' },
    { id: 'pmz2', name: 'Pendidikan Muzik', code: 'PMZ' },
  ],
  3: [
    { id: 'bm3', name: 'Bahasa Melayu', code: 'BM' },
    { id: 'bi3', name: 'Bahasa Inggeris', code: 'BI' },
    { id: 'mt3', name: 'Matematik', code: 'MT' },
    { id: 'sn3', name: 'Sains', code: 'SN' },
    { id: 'pi3', name: 'Pendidikan Islam', code: 'PI' },
    { id: 'pm3', name: 'Pendidikan Moral', code: 'PM' },
    { id: 'pjk3', name: 'Pendidikan Jasmani dan Kesihatan', code: 'PJK' },
    { id: 'psv3', name: 'Pendidikan Seni Visual', code: 'PSV' },
    { id: 'pmz3', name: 'Pendidikan Muzik', code: 'PMZ' },
  ],
  4: [
    { id: 'bm4', name: 'Bahasa Melayu', code: 'BM' },
    { id: 'bi4', name: 'Bahasa Inggeris', code: 'BI' },
    { id: 'mt4', name: 'Matematik', code: 'MT' },
    { id: 'sn4', name: 'Sains', code: 'SN' },
    { id: 'pi4', name: 'Pendidikan Islam', code: 'PI' },
    { id: 'pm4', name: 'Pendidikan Moral', code: 'PM' },
    { id: 'pjk4', name: 'Pendidikan Jasmani dan Kesihatan', code: 'PJK' },
    { id: 'psv4', name: 'Pendidikan Seni Visual', code: 'PSV' },
    { id: 'pmz4', name: 'Pendidikan Muzik', code: 'PMZ' },
    { id: 'sej4', name: 'Sejarah', code: 'SEJ' },
    { id: 'rbt4', name: 'Reka Bentuk dan Teknologi', code: 'RBT' },
  ],
  5: [
    { id: 'bm5', name: 'Bahasa Melayu', code: 'BM' },
    { id: 'bi5', name: 'Bahasa Inggeris', code: 'BI' },
    { id: 'mt5', name: 'Matematik', code: 'MT' },
    { id: 'sn5', name: 'Sains', code: 'SN' },
    { id: 'pi5', name: 'Pendidikan Islam', code: 'PI' },
    { id: 'pm5', name: 'Pendidikan Moral', code: 'PM' },
    { id: 'pjk5', name: 'Pendidikan Jasmani dan Kesihatan', code: 'PJK' },
    { id: 'psv5', name: 'Pendidikan Seni Visual', code: 'PSV' },
    { id: 'pmz5', name: 'Pendidikan Muzik', code: 'PMZ' },
    { id: 'sej5', name: 'Sejarah', code: 'SEJ' },
    { id: 'rbt5', name: 'Reka Bentuk dan Teknologi', code: 'RBT' },
  ],
  6: [
    { id: 'bm6', name: 'Bahasa Melayu', code: 'BM' },
    { id: 'bi6', name: 'Bahasa Inggeris', code: 'BI' },
    { id: 'mt6', name: 'Matematik', code: 'MT' },
    { id: 'sn6', name: 'Sains', code: 'SN' },
    { id: 'pi6', name: 'Pendidikan Islam', code: 'PI' },
    { id: 'pm6', name: 'Pendidikan Moral', code: 'PM' },
    { id: 'pjk6', name: 'Pendidikan Jasmani dan Kesihatan', code: 'PJK' },
    { id: 'psv6', name: 'Pendidikan Seni Visual', code: 'PSV' },
    { id: 'pmz6', name: 'Pendidikan Muzik', code: 'PMZ' },
    { id: 'sej6', name: 'Sejarah', code: 'SEJ' },
    { id: 'rbt6', name: 'Reka Bentuk dan Teknologi', code: 'RBT' },
  ],
};

export default function SubjectSelector({
  selectedYear,
  onSelect,
}: {
  selectedYear: number | null;
  curriculumId?: string; // tidak digunakan, disimpan untuk keserasian
  onSelect: (subject: Subject | null) => void;
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (selectedYear && SUBJECTS_BY_YEAR[selectedYear]) {
      setSubjects(SUBJECTS_BY_YEAR[selectedYear]);
      console.log('Subjek hardcoded dimuatkan untuk tahun', selectedYear);
    } else {
      setSubjects([]);
    }
  }, [selectedYear]);

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
        className="mt-1 w-full p-2 border rounded"
      >
        <option value="">Pilih Mata Pelajaran</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.code})
          </option>
        ))}
      </select>
    </div>
  );
}