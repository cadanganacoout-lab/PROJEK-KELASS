/* Jadwal & Piket interaktif (dinamis + highlight hari berjalan)
   Mendukung pemilihan Minggu Ganjil/Genap. Data diambil dari teks jadwal yang dikirim user.
*/
(function () {
  'use strict';

  const hariMap = {
    0: 'Minggu',
    1: 'Senin',
    2: 'Selasa',
    3: 'Rabu',
    4: 'Kamis',
    5: 'Jumat',
    6: 'Sabtu'
  };

  // Slot mengikuti `scheduleData.jams` (7 baris per hari)
  // 0: UP, 1: Jam 1-2, 2: IS 1, 3: Jam 3-4, 4: Jam 5-6, 5: IS 2, 6: Jam 7-8
  const scheduleData = {
    jams: [
      '06.45 - 07.30',
      '07.30 - 08.30',
      '08.30 - 09.15',
      '09.15 - 10.35',
      '10.35 - 11.55',
      '11.55 - 12.40',
      '12.40 - 14.00'
    ],
    jadwalByParity: {
      ganjil: {
        Senin: [
          { mata: 'UPACARA', guru: '-' },
          { mata: 'Bahasa Inggris', guru: 'B. Siti Nurhayati' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'Bahasa Jawa', guru: 'B. Anies Kurniawati' },
          { mata: 'Matematika', guru: 'B. Ema Dwi Novita' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'PABP', guru: 'P. Zainul Arifin' }
        ],
        Selasa: [
          { mata: 'PABP', guru: 'P. Zainul Arifin' },
          { mata: 'Pend Pancasila / PP', guru: 'B. Mita Argawati' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'PJOK', guru: 'P. Samsu Nur Z' },
          { mata: 'BIN', guru: 'B. Puji Sriwigati' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'BIN', guru: 'B. Puji Sriwigati' }
        ],
        Rabu: [
          { mata: 'BIN', guru: 'B. Puji Sriwigati' },
          { mata: 'Bahasa Jawa', guru: 'B. Anies Kurniawati' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'Bahasa Inggris', guru: 'B. Siti Nurhayati' },
          { mata: 'Matematika', guru: 'B. Ema Dwi Novita' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'Matematika', guru: 'B. Ema Dwi Novita' }
        ],
        Kamis: [
          { mata: 'Bahasa Inggris', guru: 'B. Siti Nurhayati' },
          { mata: 'BIN', guru: 'B. Puji Sriwigati' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'Sejarah', guru: 'Drs. Sudirman' },
          { mata: 'Matematika', guru: 'B. Ema Dwi Novita' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'Matematika', guru: 'B. Ema Dwi Novita' }
        ],
        Jumat: [
          { mata: 'PJOK', guru: 'P. Samsu Nur Z' },
          { mata: 'Bahasa Inggris', guru: 'B. Siti Nurhayati' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'BIN', guru: 'B. Puji Sriwigati' },
          { mata: 'Matematika', guru: 'B. Ema Dwi Novita' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'Matematika', guru: 'B. Ema Dwi Novita' }
        ],
        Sabtu: [
          { mata: 'Pend Pancasila / PP', guru: 'B. Mita Argawati' },
          { mata: 'Sejarah', guru: 'Drs. Sudirman' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'PJOK', guru: 'P. Samsu Nur Z' },
          { mata: 'PJOK', guru: 'P. Samsu Nur Z' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'PJOK', guru: 'P. Samsu Nur Z' }
        ]
      },
      genap: {
        Senin: [
          { mata: 'UPACARA', guru: '-' },
          { mata: 'DDPK', guru: 'P. IRFAN' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'DDPK', guru: 'P. IRFAN' },
          { mata: 'DDPK', guru: 'P. ERVAN' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'DDPK', guru: 'P. ERVAN' }
        ],
        Selasa: [
          { mata: 'Pendidikan IPAS / PIPAdS', guru: 'B. INDAH' },
          { mata: 'PIPAdS', guru: 'B. INDAH' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'PIPAdS', guru: 'B. INDAH' },
          { mata: 'Informatika', guru: 'P. FATCHIANO' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'Informatika', guru: 'P. FATCHIANO' }
        ],
        Rabu: [
          { mata: 'DDPK', guru: 'P. HENDRIK' },
          { mata: 'DDPK', guru: 'P. HENDRIK' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'DDPK', guru: 'P. ENDY' },
          { mata: 'DDPK', guru: 'P. ENDY' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'DDPK', guru: 'P. ENDY' }
        ],
        Kamis: [
          { mata: 'DDPK', guru: 'P. RIDWAN' },
          { mata: 'DDPK', guru: 'P. RIDWAN' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'DDPK', guru: 'P. FAQIH' },
          { mata: 'DDPK', guru: 'P. FAQIH' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'DDPK', guru: 'P. FAQIH' }
        ],
        Jumat: [
          { mata: 'SnB-ST', guru: 'B. FILLYA' },
          { mata: 'SnB-ST', guru: 'B. FILLYA' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'PIPAdS', guru: 'B. INDAH' },
          { mata: 'PIPAdS', guru: 'B. INDAH' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'PIPAdS', guru: 'B. INDAH' }
        ],
        Sabtu: [
          { mata: 'Informatika', guru: 'P. FATCHIANO' },
          { mata: 'Informatika', guru: 'P. FATCHIANO' },
          { mata: 'Istirahat 1', guru: '-' },
          { mata: 'PIPAdS', guru: 'B. INDAH' },
          { mata: 'PIPAdS', guru: 'B. INDAH' },
          { mata: 'Istirahat 2', guru: '-' },
          { mata: 'PIPAdS', guru: 'B. INDAH' }
        ]
      }
    }
  };

  const piketData = {
    byDay: {
      Senin: [
        { petugas: 'Alexa', catatan: '-' },
        { petugas: 'Aretha', catatan: '-' },
        { petugas: 'Atha', catatan: '-' },
        { petugas: 'Celvin', catatan: '-' },
        { petugas: 'Gilang', catatan: '-' },
        { petugas: 'Safika', catatan: '-' }
      ],
      Selasa: [
        { petugas: 'Relyta', catatan: '-' },
        { petugas: 'Cellsia', catatan: '-' },
        { petugas: 'Ragil Satria', catatan: '-' },
        { petugas: 'Julian', catatan: '-' },
        { petugas: 'Satria Pradika', catatan: '-' },
        { petugas: 'Rifki', catatan: '-' }
      ],
      Rabu: [
        { petugas: 'Alecia Poppy', catatan: '-' },
        { petugas: 'Diva', catatan: '-' },
        { petugas: 'Meta', catatan: '-' },
        { petugas: 'Akbar', catatan: '-' },
        { petugas: 'Dimas', catatan: '-' },
        { petugas: 'Ragil Bagus', catatan: '-' }
      ],
      Kamis: [
        { petugas: 'Gayuh Gita', catatan: '-' },
        { petugas: 'Helcia', catatan: '-' },
        { petugas: 'Hendri', catatan: '-' },
        { petugas: 'Sultan Pasha', catatan: '-' },
        { petugas: 'Kenza', catatan: '-' }
      ],
      Jumat: [
        { petugas: 'Ardilla', catatan: '-' },
        { petugas: 'Candy', catatan: '-' },
        { petugas: 'Ahmad Barrak', catatan: '-' },
        { petugas: 'Bagas', catatan: '-' },
        { petugas: 'Ficko', catatan: '-' }
      ],
      Sabtu: [
        { petugas: 'Amanda', catatan: '-' },
        { petugas: 'Ena', catatan: '-' },
        { petugas: 'Nabila', catatan: '-' },
        { petugas: 'Affandi', catatan: '-' },
        { petugas: 'Ilham Rofi g', catatan: '-' },
        { petugas: 'Khaula Nendra', catatan: '-' }
      ],
      Minggu: [{ petugas: '-', catatan: '-' }]
    }
  };

  function todayInfo() {
    const d = new Date();
    const dayIndex = d.getDay();
    const dayName = hariMap[dayIndex] || '—';
    return { dayIndex, dayName };
  }

  function setLabel(labelEl, text) {
    if (!labelEl) return;
    labelEl.textContent = text;
  }

  function getWeekParity() {
    // Hitung parity minggu secara otomatis, lalu paksa agar "minggu sekarang" = GENAP
    // (sesuai instruksi user).
    const date = new Date();

    // weekIndex: cukup sederhana (berdasarkan minggu ke-berapa dari awal tahun).
    // Parity kemudian = ganjil/genap dari weekIndex.
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000)) + 1;
    const weekIndex = Math.ceil(dayOfYear / 7);

    // Jika weekIndex genap => 'genap', jika ganjil => 'ganjil' (sementara).
    // Agar "hari ini" selalu 'genap', buat offset 0/1.
    // (offset 0: weekIndex%2==0 => genap, offset 1: dibalik)
    const assumedParity = (weekIndex % 2 === 0) ? 'genap' : 'ganjil';
    const offset = assumedParity === 'genap' ? 0 : 1;

    const finalParityIsGenap = (weekIndex % 2 === 0) ? offset === 0 : offset === 1;
    return finalParityIsGenap ? 'genap' : 'ganjil';
  }

  function setParityLabel(parity) {
    const label = document.getElementById('parityLabel');
    if (label) label.textContent = `Minggu: ${parity === 'ganjil' ? 'Ganjil' : 'Genap'}`;
  }

  function getSelectedParity() {
    const select = document.getElementById('paritySelect');
    if (!select) return getWeekParity();
    return select.value === 'genap' ? 'genap' : 'ganjil';
  }

  function buildScheduleTable(todayDayName, parity) {
    const tbody = document.getElementById('jadwalTbody');
    const label = document.getElementById('hariBerjalanLabel');
    if (!tbody) return;

    setLabel(label, `Hari ini: ${todayDayName}`);
    setParityLabel(parity);

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const parityObj = scheduleData.jadwalByParity?.[parity] || scheduleData.jadwalByParity.ganjil;

    tbody.innerHTML = '';

    const jams = scheduleData.jams || [];
    jams.forEach((jam, rowIdx) => {
      const tr = document.createElement('tr');

      const tdJam = document.createElement('td');
      tdJam.textContent = jam;
      tr.appendChild(tdJam);

      days.forEach((dayName) => {
        const td = document.createElement('td');
        const dayArr = parityObj?.[dayName] || [];
        const cell = dayArr[rowIdx] || null;

        if (cell) {
          td.innerHTML = `
            <span class="schedule-subject">
              <span class="mata">${cell.mata ?? '-'}</span>
              <span class="guru">${cell.guru ? `⟡ ${cell.guru}` : ''}</span>
            </span>
          `;
        } else {
          td.textContent = '-';
        }

        if (dayName === todayDayName) td.classList.add('today-highlight');

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  function buildPiketTable(todayDayName) {
    const tbody = document.getElementById('piketTbody');
    const label = document.getElementById('piketHariLabel');
    if (!tbody) return;

    setLabel(label, todayDayName);

    tbody.innerHTML = '';

    const rows = piketData.byDay?.[todayDayName] || [{ petugas: '-', catatan: '-' }];

    rows.forEach((r) => {
      const tr = document.createElement('tr');

      const tdHari = document.createElement('td');
      tdHari.textContent = todayDayName;
      tr.appendChild(tdHari);

      const tdPetugas = document.createElement('td');
      tdPetugas.innerHTML = r.petugas || '-';
      tdPetugas.classList.add('today-highlight');
      tr.appendChild(tdPetugas);

      const tdCatatan = document.createElement('td');
      tdCatatan.textContent = r.catatan || '-';
      tr.appendChild(tdCatatan);

      tbody.appendChild(tr);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const { dayName } = todayInfo();

    const paritySelect = document.getElementById('paritySelect');
    const defaultParity = getWeekParity();
    if (paritySelect && !paritySelect.value) paritySelect.value = defaultParity;

    const parity = getSelectedParity();
    buildScheduleTable(dayName, parity);
    buildPiketTable(dayName);

    if (paritySelect) {
      paritySelect.addEventListener('change', () => {
        const p = getSelectedParity();
        buildScheduleTable(dayName, p);
      });
    }
  });
})();

