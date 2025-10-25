import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { rooms } from './schema';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

// Dummy room data
const dummyRooms = [
  {
    roomNumber: '101',
    floor: 1,
    pricePerMonth: '1500000',
    status: 'available' as const,
    facilities: JSON.stringify(['AC', 'Kasur', 'Lemari', 'Meja Belajar', 'WiFi', 'Kamar Mandi Dalam']),
    size: '3x4m',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ]),
    description: 'Kamar nyaman di lantai 1 dengan fasilitas lengkap. Dekat dengan area parkir dan akses mudah ke fasilitas umum.',
  },
  {
    roomNumber: '102',
    floor: 1,
    pricePerMonth: '1400000',
    status: 'available' as const,
    facilities: JSON.stringify(['AC', 'Kasur', 'Lemari', 'Meja Belajar', 'WiFi']),
    size: '3x3m',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    ]),
    description: 'Kamar cozy dengan ventilasi baik dan pencahayaan natural. Cocok untuk mahasiswa atau pekerja muda.',
  },
  {
    roomNumber: '201',
    floor: 2,
    pricePerMonth: '1600000',
    status: 'occupied' as const,
    facilities: JSON.stringify(['AC', 'Kasur', 'Lemari', 'Meja Belajar', 'WiFi', 'Kamar Mandi Dalam', 'Balkon']),
    size: '4x4m',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
    ]),
    description: 'Kamar premium di lantai 2 dengan balkon pribadi. View bagus dan suasana tenang untuk bekerja atau belajar.',
  },
  {
    roomNumber: '202',
    floor: 2,
    pricePerMonth: '1550000',
    status: 'available' as const,
    facilities: JSON.stringify(['AC', 'Kasur', 'Lemari', 'Meja Belajar', 'WiFi', 'Kamar Mandi Dalam']),
    size: '3x4m',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
    ]),
    description: 'Kamar modern dengan desain minimalis. Dilengkapi dengan furniture berkualitas dan pencahayaan LED.',
  },
  {
    roomNumber: '203',
    floor: 2,
    pricePerMonth: '1450000',
    status: 'available' as const,
    facilities: JSON.stringify(['Kipas Angin', 'Kasur', 'Lemari', 'Meja Belajar', 'WiFi']),
    size: '3x3m',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800',
    ]),
    description: 'Kamar sederhana tapi nyaman dengan fasilitas dasar lengkap. Harga terjangkau untuk budget mahasiswa.',
  },
  {
    roomNumber: '301',
    floor: 3,
    pricePerMonth: '1700000',
    status: 'available' as const,
    facilities: JSON.stringify(['AC', 'Kasur King', 'Lemari', 'Meja Belajar', 'WiFi', 'Kamar Mandi Dalam', 'Balkon', 'Smart TV']),
    size: '4x5m',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
      'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800',
    ]),
    description: 'Kamar deluxe di lantai paling atas dengan view terbaik. Fasilitas premium termasuk Smart TV dan kasur king size.',
  },
  {
    roomNumber: '302',
    floor: 3,
    pricePerMonth: '1650000',
    status: 'maintenance' as const,
    facilities: JSON.stringify(['AC', 'Kasur', 'Lemari', 'Meja Belajar', 'WiFi', 'Kamar Mandi Dalam']),
    size: '4x4m',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800',
      'https://images.unsplash.com/photo-1616594266889-da3c16c2e9e7?w=800',
    ]),
    description: 'Kamar sedang dalam tahap perawatan dan perbaikan. Akan segera tersedia dengan kondisi lebih baik.',
  },
  {
    roomNumber: '303',
    floor: 3,
    pricePerMonth: '1600000',
    status: 'available' as const,
    facilities: JSON.stringify(['AC', 'Kasur', 'Lemari', 'Meja Belajar', 'WiFi', 'Kamar Mandi Dalam', 'Balkon']),
    size: '4x4m',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
    ]),
    description: 'Kamar lantai 3 dengan sirkulasi udara baik. Tenang dan cocok untuk fokus kerja atau belajar.',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting seed...');
    
    // Insert dummy rooms
    console.log('📦 Inserting rooms...');
    await db.insert(rooms).values(dummyRooms);
    
    console.log('✅ Seed completed successfully!');
    console.log(`📊 Inserted ${dummyRooms.length} rooms`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

