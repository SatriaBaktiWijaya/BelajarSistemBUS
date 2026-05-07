import { TabType, ModuleContent, Question } from "./types";

export const CONTENT: ModuleContent[] = [
  {
    id: TabType.INTERACTION,
    title: "Interaksi Komponen Utama",
    description: "Bagaimana CPU, Memori, dan I/O berkomunikasi.",
    steps: [
      {
        title: "Komponen Inti",
        content: "Komputer terdiri dari tiga modul utama: CPU (Control & Processing), Memori Utama (Storage), dan I/O (Input/Output). Ketiganya harus terhubung untuk menjalankan perintah."
      },
      {
        title: "Register CPU",
        content: "CPU menggunakan register khusus: PC (Program Counter), IR (Instruction Register) untuk instruksi, MAR (Memory Address Register) untuk alamat, dan MBR (Memory Buffer Register) untuk data transfer."
      },
      {
        title: "Siklus Koneksi",
        content: "Memori menerima sinyal Read/Write. I/O diperlakukan mirip memori namun berfungsi menjembatani dunia luar dengan komputer."
      }
    ]
  },
  {
    id: TabType.STRUCTURE,
    title: "Jenis & Struktur Bus",
    description: "Memahami jalur komunikasi broadcast antar perangkat.",
    steps: [
      {
        title: "Struktur Sistem Bus",
        content: "Sistem bus terbagi menjadi tiga: Bus Data (mengirim data), Bus Alamat (menentukan kapasitas memori), dan Bus Kontrol (mengatur timing & akses)."
      },
      {
        title: "Hirarki Bus",
        content: "Untuk mengatasi bottleneck, sistem menggunakan Multiple Bus: Local Bus, System Bus, High-Speed Bus, dan Expansion Bus."
      }
    ]
  },
  {
    id: TabType.DESIGN,
    title: "Elemen Perancangan Bus",
    description: "Strategi desain untuk mengoptimalkan transfer data.",
    steps: [
      {
        title: "Arbitrasi & Timing",
        content: "Arbitrasi bisa Terpusat atau Terdistribusi. Timing bisa Sinkron (berdasarkan clock) atau Asinkron (berdasarkan event)."
      },
      {
        title: "Tipe Transfer",
        content: "Mendukung operasi Read, Write, Read-modify-write, dan Block data transfer untuk efisiensi tinggi."
      }
    ]
  },
  {
    id: TabType.PCI,
    title: "Karakteristik Bus PCI",
    description: "Standar industri untuk interkoneksi berkecepatan tinggi.",
    steps: [
      {
        title: "Spesifikasi Dasar",
        content: "PCI beroperasi pada 32/64 bit, bersifat processor-independent, menggunakan multiplexed lines, dan synchronous timing."
      },
      {
        title: "Konfigurasi Pin",
        content: "Memiliki 49 pin wajib dan pin opsional untuk Interrupt, Cache, dan fungsi spesifik lainnya."
      }
    ]
  }
];

export const SIM_READ_STEPS = [
  "Alamat & Komando: Inisiator (CPU) menurunkan sinyal FRAME# dan menaruh Alamat Memori di jalur AD serta perintah READ di jalur C/BE#.",
  "Persiapan Master: Master (CPU) mengaktifkan IRDY# (Initiator Ready) untuk menunjukkan ia siap menerima data dari target.",
  "Seleksi Target: Perangkat target (Memori) mengenali alamatnya, mengaktifkan DEVSEL# untuk mengklaim bus, dan mulai menyiapkan data.",
  "Transfer Data: Target mengaktifkan TRDY# (Target Ready) saat data di jalur AD sudah valid. Data berpindah dari Memori ke CPU.",
  "Terminasi: Setelah semua data terbaca, Master melepas FRAME# dan IRDY#. Bus kembali ke keadaan Idle (bebas)."
];

export const SIM_ARB_STEPS = [
  "Permintaan Akses: Modul A mengirim sinyal REQ-A# ke Central Arbiter karena ingin mengirim data. Arbiter membalas dengan GNT-A# (Grant).",
  "Antrian Prioritas: Saat Modul A menggunakan bus, Modul B juga meminta akses melalui REQ-B#. Arbiter menyimpan permintaan ini dalam antrian.",
  "Perpindahan Hak: Arbiter menarik GNT-A# dan mengaktifkan GNT-B#. Modul A harus menyelesaikan transaksi terakhirnya segera.",
  "Transisi Master: Modul A melepas kendali bus (Bus Idle). Modul B mendeteksi bus kosong dan mulai mengaktifkan FRAME# sebagai Master baru.",
  "Visualisasi Sistem: Sekarang lihat bagaimana Arbiter menyeimbangkan beban komunikasi antara semua perangkat di bus PCI."
];

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Register mana yang menampung alamat memori yang akan dibaca atau ditulis?",
    options: ["Program Counter", "Memory Address Register", "Instruction Register", "Memory Buffer Register"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Apa fungsi utama dari Bus Kontrol?",
    options: ["Menaruh data", "Menentukan kapasitas memori", "Mengatur akses dan timing", "Menghubungkan monitor"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "Jenis arbitrasi yang menggunakan pengontrol pusat disebut?",
    options: ["Distributed", "Centralized", "Multiplexed", "Synchronous"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Pada simulasi PCI Read, sinyal apa yang menandakan data di bus valid?",
    options: ["FRAME", "IRDY", "TRDY", "DEVSEL"],
    correctAnswer: 2
  }
];
