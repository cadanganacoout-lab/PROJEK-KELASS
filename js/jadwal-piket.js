/* Jadwal & Piket interaktif (dinamis + highlight hari berjalan)
   Mendukung pemilihan Minggu Ganjil/Genap. Data jadwal: XI RPL 2026-2027.
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

  // Kepanjangan kode mata pelajaran, dipakai sebagai tooltip (title) pada tabel.
  const legend = {
    BIN: 'Bahasa Indonesia',
    BIG: 'Bahasa Inggris',
    MTK: 'Matematika',
    SEJ: 'Sejarah',
    BJ: 'Bahasa Jawa',
    PJOK: 'Pendidikan Jasmani Olahraga Kesehatan',
    KKRD: 'Konsentrasi Keahlian RPL',
    MPPRDPG: 'Mata Pelajaran Pilihan RPL',
    BK: 'Bimbingan Konseling',
    KIdK: 'Kreativitas Inovasi dan Kewirausahaan',
    PABP: 'Pendidikan Agama Budi Pekerti',
    PP: 'Pendidikan Pancasila'
  };

  // Catatan penting: jam pelajaran TIDAK sama persis di tiap hari (Senin ada UPACARA,
  // Jumat & Sabtu pulang lebih awal dengan hanya 1x istirahat, dst). Karena itu setiap
  // sel jadwal menyimpan waktunya sendiri-sendiri (properti `waktu`), dan kolom paling
  // kiri tabel hanya berfungsi sebagai nomor sesi, bukan patokan jam yang sama untuk
  // semua hari.
  const scheduleData = {
    sesi: ['Sesi 1', 'Sesi 2', 'Sesi 3', 'Sesi 4', 'Sesi 5', 'Sesi 6', 'Sesi 7'],
    ruang: {
      ganjil: 'R-08',
      genap: 'R-LUBAN'
    },
    jadwalByParity: {
      ganjil: {
        Senin: [
          { waktu: '06.45 - 07.30', mata: 'UPACARA', guru: '-' },
          { waktu: '07.30 - 08.50', mata: 'MTK', guru: 'Erna Dwi Novita, S.Pd' },
          { waktu: '08.50 - 10.10', mata: 'SEJ', guru: 'Edlin Vivi Muratrie, S.Pd' },
          { waktu: '10.10 - 10.35', mata: 'Istirahat 1', guru: '-' },
          { waktu: '10.35 - 11.55', mata: 'KIdK', guru: 'Linda Savitri, S.Pd' },
          { waktu: '11.55 - 12.40', mata: 'Istirahat 2', guru: '-' },
          { waktu: '12.40 - 14.00', mata: 'BIG', guru: 'Afrida Vidiyastuti, S.Pd' }
        ],
        Selasa: [
          { waktu: '06.45 - 08.15', mata: 'PABP', guru: 'Zainul Arifin, S.Ag, M.PdI' },
          { waktu: '08.15 - 09.45', mata: 'BIN', guru: 'Viska Kholifatul Ummah, S.Pd' },
          { waktu: '09.45 - 10.15', mata: 'Istirahat 1', guru: '-' },
          { waktu: '10.15 - 11.45', mata: 'MTK', guru: 'Erna Dwi Novita, S.Pd' },
          { waktu: '11.45 - 12.30', mata: 'Istirahat 2', guru: '-' },
          { waktu: '12.30 - 14.00', mata: 'BIG', guru: 'Afrida Vidiyastuti, S.Pd' }
        ],
        Rabu: [
          { waktu: '06.45 - 08.15', mata: 'BIN', guru: 'Viska Kholifatul Ummah, S.Pd' },
          { waktu: '08.15 - 09.45', mata: 'PABP', guru: 'Zainul Arifin, S.Ag, M.PdI' },
          { waktu: '09.45 - 10.15', mata: 'Istirahat 1', guru: '-' },
          { waktu: '10.15 - 11.45', mata: 'BIG', guru: 'Afrida Vidiyastuti, S.Pd' },
          { waktu: '11.45 - 12.30', mata: 'Istirahat 2', guru: '-' },
          { waktu: '12.30 - 14.00', mata: 'BJ', guru: 'Anies Kurniawati, S.Pd' }
        ],
        Kamis: [
          { waktu: '06.45 - 08.15', mata: 'BIN', guru: 'Viska Kholifatul Ummah, S.Pd' },
          { waktu: '08.15 - 09.45', mata: 'PJOK', guru: 'Samsu Nur Zamaniyanto, S.Pd' },
          { waktu: '09.45 - 10.15', mata: 'Istirahat 1', guru: '-' },
          { waktu: '10.15 - 11.45', mata: 'MTK', guru: 'Erna Dwi Novita, S.Pd' },
          { waktu: '11.45 - 12.30', mata: 'Istirahat 2', guru: '-' },
          { waktu: '12.30 - 14.00', mata: 'SEJ', guru: 'Edlin Vivi Muratrie, S.Pd' }
        ],
        Jumat: [
          { waktu: '06.45 - 07.45', mata: 'PP', guru: 'Mita Argawati, S.Pd' },
          { waktu: '07.45 - 08.45', mata: 'BJ', guru: 'Anies Kurniawati, S.Pd' },
          { waktu: '08.45 - 09.00', mata: 'Istirahat', guru: '-' },
          { waktu: '09.00 - 10.00', mata: 'KIdK', guru: 'Linda Savitri, S.Pd' },
          { waktu: '10.00 - 11.00', mata: 'BK', guru: 'Mutia Dwi Zulfana, S.Pd.' }
        ],
        Sabtu: [
          { waktu: '06.45 - 07.45', mata: 'PJOK', guru: 'Samsu Nur Zamaniyanto, S.Pd' },
          { waktu: '07.45 - 08.45', mata: 'PP', guru: 'Mita Argawati, S.Pd' },
          { waktu: '08.45 - 09.00', mata: 'Istirahat', guru: '-' },
          { waktu: '09.00 - 10.00', mata: 'BIG', guru: 'Afrida Vidiyastuti, S.Pd' }
        ]
      },
      genap: {
        Senin: [
          { waktu: '06.45 - 07.30', mata: 'UPACARA', guru: '-' },
          { waktu: '07.30 - 08.50', mata: 'KKRD', guru: 'Andies Pramudiyantoro, S.Kom' },
          { waktu: '08.50 - 10.10', mata: 'KKRD', guru: 'Andies Pramudiyantoro, S.Kom' },
          { waktu: '10.10 - 10.35', mata: 'Istirahat 1', guru: '-' },
          { waktu: '10.35 - 11.55', mata: 'KKRD', guru: 'Andies Pramudiyantoro, S.Kom' },
          { waktu: '11.55 - 12.40', mata: 'Istirahat 2', guru: '-' },
          { waktu: '12.40 - 14.00', mata: 'KKRD', guru: 'Andies Pramudiyantoro, S.Kom' }
        ],
        Selasa: [
          { waktu: '06.45 - 08.15', mata: 'KKRD', guru: 'Endy Bagus Setyawan R. S.Kom' },
          { waktu: '08.15 - 09.45', mata: 'KKRD', guru: 'Endy Bagus Setyawan R. S.Kom' },
          { waktu: '09.45 - 10.15', mata: 'Istirahat 1', guru: '-' },
          { waktu: '10.15 - 11.45', mata: 'KKRD', guru: 'Endy Bagus Setyawan R. S.Kom' },
          { waktu: '11.45 - 12.30', mata: 'Istirahat 2', guru: '-' },
          { waktu: '12.30 - 14.00', mata: 'KKRD', guru: 'Endy Bagus Setyawan R. S.Kom' }
        ],
        Rabu: [
          { waktu: '06.45 - 08.15', mata: 'KKRD', guru: 'Endy Bagus Setyawan R. S.Kom' },
          { waktu: '08.15 - 09.45', mata: 'KKRD', guru: 'Endy Bagus Setyawan R. S.Kom' },
          { waktu: '09.45 - 10.15', mata: 'Istirahat 1', guru: '-' },
          { waktu: '10.15 - 11.45', mata: 'KKRD', guru: 'Muh. Faqihuddin Assholih, S.Kom' },
          { waktu: '11.45 - 12.30', mata: 'Istirahat 2', guru: '-' },
          { waktu: '12.30 - 14.00', mata: 'KKRD', guru: 'Muh. Faqihuddin Assholih, S.Kom' }
        ],
        Kamis: [
          { waktu: '06.45 - 08.15', mata: 'KKRD', guru: 'Hendrik Dwi Yusyanto, S.Kom' },
          { waktu: '08.15 - 09.45', mata: 'KKRD', guru: 'Hendrik Dwi Yusyanto, S.Kom' },
          { waktu: '09.45 - 10.15', mata: 'Istirahat 1', guru: '-' },
          { waktu: '10.15 - 11.45', mata: 'KKRD', guru: 'Hendrik Dwi Yusyanto, S.Kom' },
          { waktu: '11.45 - 12.30', mata: 'Istirahat 2', guru: '-' },
          { waktu: '12.30 - 14.00', mata: 'KKRD', guru: 'Hendrik Dwi Yusyanto, S.Kom' }
        ],
        Jumat: [
          { waktu: '06.45 - 07.45', mata: 'KKRD', guru: 'Ridwan Mudakir, S.Kom' },
          { waktu: '07.45 - 08.45', mata: 'KKRD', guru: 'Ridwan Mudakir, S.Kom' },
          { waktu: '08.45 - 09.00', mata: 'Istirahat', guru: '-' },
          { waktu: '09.00 - 10.00', mata: 'KKRD', guru: 'Ridwan Mudakir, S.Kom' },
          { waktu: '10.00 - 11.00', mata: 'KKRD', guru: 'Ridwan Mudakir, S.Kom' }
        ],
        Sabtu: [
          { waktu: '06.45 - 07.45', mata: 'MPPRDPG', guru: 'Muh. Faqihuddin Assholih, S.Kom' },
          { waktu: '07.45 - 08.45', mata: 'MPPRDPG', guru: 'Muh. Faqihuddin Assholih, S.Kom' },
          { waktu: '08.45 - 09.00', mata: 'Istirahat', guru: '-' },
          { waktu: '09.00 - 10.00', mata: 'MPPRDPG', guru: 'Muh. Faqihuddin Assholih, S.Kom' }
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
    if (!label) return;
    const ruang = scheduleData.ruang?.[parity] || '-';
    label.textContent = `Minggu: ${parity === 'ganjil' ? 'Ganjil' : 'Genap'} · Ruang ${ruang}`;
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

    const sesi = scheduleData.sesi || [];
    sesi.forEach((label, rowIdx) => {
      const tr = document.createElement('tr');

      const tdSesi = document.createElement('td');
      tdSesi.textContent = label;
      tr.appendChild(tdSesi);

      days.forEach((dayName) => {
        const td = document.createElement('td');
        const dayArr = parityObj?.[dayName] || [];
        const cell = dayArr[rowIdx] || null;

        if (cell) {
          const fullName = legend[cell.mata] || '';
          td.innerHTML = `
            <span class="schedule-subject">
              <span class="waktu" style="display:block;font-size:0.75em;opacity:0.65;">${cell.waktu ?? ''}</span>
              <span class="mata" title="${fullName}">${cell.mata ?? '-'}</span>
              <span class="guru">${cell.guru && cell.guru !== '-' ? `⟡ ${cell.guru}` : ''}</span>
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