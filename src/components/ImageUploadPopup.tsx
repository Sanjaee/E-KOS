// components/ImageUploadDialog.tsx
import { useState, useRef, FC } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Upload, Copy, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUploaded?: (imageData: UploadedImageData) => void;
}

interface UploadedImageData {
  url: string;
  publicId: string;
}

const ImageUploadDialog: FC<ImageUploadDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  onImageUploaded 
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImageData | null>(null);
  const [error, setError] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.match('image.*')) {
        uploadImage(file);
      } else {
        setError('Please select a valid image file');
      }
    }
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }
      
      setUploadedImage(data);
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded to Cloudinary.",
        variant: "default",
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong during upload');
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload image to Cloudinary.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (uploadedImage) {
      try {
        await navigator.clipboard.writeText(uploadedImage.url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "URL Copied",
          description: "Image URL has been copied to clipboard.",
          variant: "default",
        });
      } catch (err) {
        setError('Failed to copy to clipboard');
      }
    }
  };

  const handleUseImage = () => {
    if (uploadedImage && onImageUploaded) {
      onImageUploaded(uploadedImage);
    }
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload an image to Cloudinary and get a shareable URL
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <X className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          {!uploadedImage ? (
            <div className="grid gap-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Drag and drop your image here or click to browse
                  </p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <Button 
                    variant="secondary" 
                    disabled={isUploading}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Select Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="flex justify-center border rounded-md p-2 bg-gray-50">
                <img 
                  src={uploadedImage.url} 
                  alt="Uploaded" 
                  className="max-h-[200px] object-contain rounded"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="image-url">Image URL</Label>
                <div className="flex">
                  <Input
                    id="image-url"
                    value={uploadedImage.url}
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-l-none px-3"
                    onClick={handleCopyUrl}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          {uploadedImage ? (
            <>
              <Button variant="outline" onClick={resetUpload}>
                Upload Another
              </Button>
              {onImageUploaded ? (
                <Button onClick={handleUseImage}>
                  Use This Image
                </Button>
              ) : (
                <Button onClick={() => onOpenChange(false)}>
                  Done
                </Button>
              )}
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="ml-auto"
            >
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;