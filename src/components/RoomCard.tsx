import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  DollarSign, 
  Ruler, 
  CheckCircle2,
  XCircle,
  Wrench,
  Heart,
  Star,
  Eye
} from 'lucide-react';

type RoomStatus = 'available' | 'occupied' | 'maintenance';

interface Room {
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
}

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const facilities = room.facilities ? JSON.parse(room.facilities) : [];
  const images = room.images ? JSON.parse(room.images) : [];
  const firstImage = images[0] || '/placeholder-room.jpg';

  const formatPrice = (price: string | null) => {
    if (!price) return 'N/A';
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}jt`;
    }
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const isAvailable = room.status === 'available';

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={firstImage}
          alt={`Kamar ${room.roomNumber}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges Overlay */}
        <div className="absolute inset-0 p-2">
          <div className="flex items-start justify-between">
            {/* Status Badge */}
            {!isAvailable && (
              <Badge className={`${
                room.status === 'occupied' 
                  ? 'bg-red-500 hover:bg-red-500' 
                  : 'bg-yellow-500 hover:bg-yellow-500'
              } text-white border-0 text-xs px-2 py-1`}>
                {room.status === 'occupied' ? 'Terisi' : 'Maintenance'}
              </Badge>
            )}
            {isAvailable && (
              <Badge className="bg-green-500 hover:bg-green-500 text-white border-0 text-xs px-2 py-1">
                Tersedia
              </Badge>
            )}
            
            {/* Favorite Button */}
            <button className="p-1.5 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 rounded-full transition-colors backdrop-blur-sm">
              <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Bottom Overlay - Views */}
        <div className="absolute bottom-2 left-2">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
            <Eye className="w-3 h-3" />
            <span>{Math.floor(room.id * 47 + 100)}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
          Kamar Kos #{room.roomNumber} - Lantai {room.floor}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">Jakarta Selatan</span>
        </div>

        {/* Facilities Mini */}
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <span className="truncate">
            {facilities.slice(0, 3).join(' • ')}
            {facilities.length > 3 && '...'}
          </span>
        </div>

        {/* Rating & Size */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900 dark:text-white">4.9</span>
            <span className="text-gray-500 dark:text-gray-400">(127)</span>
          </div>
          <span className="text-gray-400">•</span>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Ruler className="w-3 h-3" />
            <span>{room.size}</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Rp{formatPrice(room.pricePerMonth)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">/bln</span>
          </div>
          
          {/* Additional Info */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              Free biaya admin
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {Math.floor(room.id * 3 + 15)} terjual
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

