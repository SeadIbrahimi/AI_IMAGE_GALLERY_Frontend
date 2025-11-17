import { useState } from "react";
import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Clock, Loader2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ImageCardProps {
  image: {
    id: string;
    filename: string;
    url: string;
    tags: string[];
    uploadTime: string;
    status: "processing" | "complete";
  };
  onClick: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className=" bg-white rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={image.url}
          alt={image.filename}
          className="w-full h-full object-cover"
        />

        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(102, 126, 234, 0.9)" }}
          >
            <span className="text-white px-4 text-center">
              Click to view details
            </span>
          </motion.div>
        )}

        {image.status === "processing" && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex items-center gap-2 text-white">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <p className="truncate" style={{ color: "#2D3748" }}>
          {image.filename}
        </p>

        <div className="flex flex-wrap gap-2">
          {image.tags.map((tag) => (
            <Badge
              key={tag}
              className="px-2 py-1 rounded-full border-0 uppercase"
              style={{
                background: "#E2E8F0",
                color: "#667EEA",
                fontSize: "12px",
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1.5" style={{ color: "#718096" }}>
          <Clock className="w-4 h-4" />
          <span>{image.uploadTime}</span>
        </div>

        {image.status === "complete" && (
          <div className="pt-2">
            <span
              className="uppercase"
              style={{ color: "#48BB78", fontSize: "12px" }}
            >
              AI Complete
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
