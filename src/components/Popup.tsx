import { useEffect, useState, useCallback, memo, ReactNode } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

// Interface untuk props Modal
interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

// Komponen Modal yang di-memoized untuk mencegah render ulang yang tidak perlu
const Modal = memo<ModalProps>(({ children, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      style={{ 
        willChange: "opacity",
        touchAction: "none",
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full sm:max-w-md mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

// Komponen utama yang sudah dioptimasi
const PopupCard = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const closePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  // Handler untuk tombol Esc - dengan useCallback untuk mencegah recreate pada setiap render
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closePopup();
    }
  }, [closePopup]);

  // Lazy initialization untuk popup
  useEffect(() => {
    // Hanya jalankan di client-side
    if (typeof window === "undefined") return;
    
    setIsMounted(true);
    
    // Gunakan setTimeout untuk menunda popup
    const timeoutId = window.setTimeout(() => {
      setShowPopup(true);
    }, 2000);
    
    // Event listener
    window.addEventListener('keydown', handleKeyDown, { passive: true });
    
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleBarcodeClick = useCallback(() => {
    if (typeof window !== "undefined") {
      window.open("https://saweria.co/ahmadafriza", "_blank", "noopener,noreferrer");
    }
  }, []);

  // Jangan render apapun jika belum di-mount
  if (!isMounted) return null;

  // Gunakan createPortal untuk memindahkan modal ke luar dari alur render normal
  return showPopup && typeof document !== 'undefined' ? createPortal(
    <Modal onClose={closePopup}>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 text-red-700">
        Dukung Saya di Saweria
      </h2>
      <p className="text-gray-900 mb-3 text-sm sm:text-base">
        Klik barcode di bawah atau scan untuk membeli domain di website
        ini agar bisa dipublikasikan ke semua user.
      </p>
      <div
        className={`relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4 transition-transform duration-200 ${
          isImageLoaded ? "hover:scale-105" : ""
        }`}
      >
        <Image
          src="/saweria.png"
          alt="Barcode Saweria"
          priority
          fill
          sizes="(max-width: 640px) 160px, 192px"
          className="object-contain cursor-pointer"
          onClick={handleBarcodeClick}
          onLoad={() => setIsImageLoaded(true)}
          loading="eager"
        />
      </div>
      <button
        onClick={closePopup}
        className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded
        transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        type="button"
      >
        Close
      </button>
      <p className="text-gray-500 text-xs mt-2">Press ESC to close</p>
    </Modal>,
    document.body
  ) : null;
};

export default memo(PopupCard);