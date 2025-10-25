import React, { useState, useMemo } from "react";
import { drizzle } from "drizzle-orm/node-postgres";
import { rooms } from "../db/schema";
import { desc } from "drizzle-orm";
import HeroBanner from "@/components/HeroBanner";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, Grid3x3, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

// Initialize drizzle
const db = drizzle(process.env.DATABASE_URL!);

// Types
type RoomStatus = 'available' | 'occupied' | 'maintenance';

type Room = {
  id: number;
  roomNumber: string | null;
  floor: number | null;
  pricePerMonth: string | null;
  status: RoomStatus | null;
  facilities: string | null;
  size: string | null;
  images: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface HomeProps {
  initialRooms: (Room & { createdAt: string; updatedAt: string })[];
  floors: number[];
  statuses: string[];
}

export default function Home({ initialRooms, floors, statuses }: HomeProps) {
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<string>("default");

  // Convert serialized dates back to Date objects
  const roomsWithDates = useMemo(() => {
    return initialRooms.map(room => ({
      ...room,
      createdAt: new Date(room.createdAt),
      updatedAt: new Date(room.updatedAt),
    }));
  }, [initialRooms]);

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    let filtered = roomsWithDates.filter((room) => {
      const floorMatch = selectedFloor === "all" || room.floor === parseInt(selectedFloor);
      const statusMatch = selectedStatus === "all" || room.status === selectedStatus;
      return floorMatch && statusMatch;
    });

    // Sort by price
    if (priceSort === "low") {
      filtered = [...filtered].sort((a, b) => 
        parseFloat(a.pricePerMonth || "0") - parseFloat(b.pricePerMonth || "0")
      );
    } else if (priceSort === "high") {
      filtered = [...filtered].sort((a, b) => 
        parseFloat(b.pricePerMonth || "0") - parseFloat(a.pricePerMonth || "0")
      );
    }

    return filtered;
  }, [roomsWithDates, selectedFloor, selectedStatus, priceSort]);

  // Get counts for each status
  const availableCount = roomsWithDates.filter(r => r.status === 'available').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                <SlidersHorizontal className="w-5 h-5 text-gray-900 dark:text-white" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Filter</h3>
              </div>

              {/* Status Filter */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Status Kamar
                </label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="available">
                      ✅ Tersedia ({availableCount})
                    </SelectItem>
                    {statuses.map((status) => (
                      status !== 'available' && (
                        <SelectItem key={status} value={status}>
                          {status === 'occupied' ? '❌ Terisi' : '🔧 Maintenance'}
                        </SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Floor Filter */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Lantai
                </label>
                <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua Lantai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Lantai</SelectItem>
                    {floors.map((floor) => (
                      <SelectItem key={floor} value={floor.toString()}>
                        Lantai {floor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Sort */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Urutkan Harga
                </label>
                <Select value={priceSort} onValueChange={setPriceSort}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="low">Termurah</SelectItem>
                    <SelectItem value="high">Termahal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filter */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedFloor("all");
                  setSelectedStatus("all");
                  setPriceSort("default");
                }}
              >
                Reset Filter
              </Button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Semua Kamar Kos
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Menampilkan {filteredRooms.length} dari {roomsWithDates.length} kamar
                  </p>
                </div>
                
                {/* View Toggle (Optional) */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Rooms Grid */}
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <SlidersHorizontal className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Tidak ada kamar ditemukan
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Coba ubah filter pencarian Anda
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedFloor("all");
                      setSelectedStatus("all");
                      setPriceSort("default");
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination (Optional) */}
            {filteredRooms.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button variant="outline" disabled>
                  Sebelumnya
                </Button>
                <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600">
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">
                  Selanjutnya
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Fetch rooms data at build time
export async function getStaticProps() {
  try {
    // Fetch rooms using Drizzle
    const fetchedRooms = await db
      .select()
      .from(rooms)
      .orderBy(desc(rooms.createdAt));

    // Transform dates for serialization
    const serializedRooms = fetchedRooms.map((room) => ({
      ...room,
      createdAt: new Date(room.createdAt!).toISOString(),
      updatedAt: new Date(room.updatedAt!).toISOString(),
    }));

    // Get unique floors
    const floorSet = new Set(fetchedRooms.map((room) => room.floor).filter((floor): floor is number => floor !== null));
    const floors = Array.from(floorSet).sort((a, b) => a - b);

    // Get unique statuses
    const statusSet = new Set(fetchedRooms.map((room) => room.status).filter((status): status is RoomStatus => status !== null));
    const statuses = Array.from(statusSet);

    return {
      props: {
        initialRooms: serializedRooms,
        floors,
        statuses,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return {
      props: {
        initialRooms: [],
        floors: [],
        statuses: [],
      },
      revalidate: 60,
    };
  }
}
