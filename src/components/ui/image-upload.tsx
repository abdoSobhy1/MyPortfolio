import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./button";
import { Input } from "./input";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  onRemove?: () => void;
  className?: string;
  bucket?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  bucket = "project-images",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onChange?.(publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        uploadFile(file);
      } else {
        toast({
          title: "Error",
          description: "Please select an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemove = async () => {
    if (value && onRemove) {
      try {
        // Extract file path from URL for Supabase storage
        const url = new URL(value);
        const pathParts = url.pathname.split("/");
        const bucketIndex = pathParts.findIndex((part) => part === bucket);

        if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
          // Get the file path after the bucket name
          const filePath = pathParts.slice(bucketIndex + 1).join("/");

          if (filePath) {
            const { error } = await supabase.storage
              .from(bucket)
              .remove([filePath]);

            if (error) {
              console.warn("Error removing file from storage:", error);
              // Continue with UI removal even if storage deletion fails
            }
          }
        }

        onRemove();

        toast({
          title: "Success",
          description: "Image removed successfully!",
        });
      } catch (error) {
        console.error("Error removing file:", error);
        // Still remove from UI even if storage deletion fails
        onRemove();
        toast({
          title: "Warning",
          description:
            "Image removed from form, but may still exist in storage.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-48 object-cover rounded-md border"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-muted rounded-md p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Click to upload an image</p>
          <p className="text-sm text-muted-foreground">
            PNG, JPG, JPEG up to 10MB
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>

        {value && (
          <Button variant="outline" onClick={handleRemove}>
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
