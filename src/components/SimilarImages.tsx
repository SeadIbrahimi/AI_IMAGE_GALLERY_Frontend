import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, ImageOff } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiService, SimilarImage } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';

export default function SimilarImages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const [originalImage, setOriginalImage] = useState<{ id: number; filename: string; url: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarImages = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const imageId = parseInt(id);
        const response = await apiService.getSimilarImages(imageId, 6);

        setSimilarImages(response.similar_images);

        // Fetch original image details
        const originalImageData = await apiService.getImageById(imageId);
        setOriginalImage({
          id: originalImageData.id,
          filename: originalImageData.filename,
          url: originalImageData.thumbnail_url,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load similar images';
        setError(message);
        console.error('Failed to fetch similar images:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarImages();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg font-medium" style={{ color: '#667EEA' }}>
            Finding similar images...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <ImageOff className="w-24 h-24 mb-4 text-gray-400 dark:text-gray-600" />
          <h2 className="text-gray-800 dark:text-gray-200">Failed to load similar images</h2>
          <p className="mt-2 mb-6 text-gray-600 dark:text-gray-400">{error}</p>
          <Button onClick={() => navigate(`/image/${id}`)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Image
          </Button>
        </div>
      </div>
    );
  }

  if (!originalImage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800">
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="container mx-auto px-8 py-4">
          <Button
            onClick={() => navigate(`/image/${id}`)}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Image
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-8 py-8">
        <h1 className="mb-8 text-gray-800 dark:text-gray-200">Similar Images</h1>

        {similarImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ImageOff className="w-24 h-24 mb-4 text-gray-400 dark:text-gray-600" />
            <h2 className="text-gray-800 dark:text-gray-200">No similar images found</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We couldn't find any similar images at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg sticky top-8">
                <div className="p-4">
                  <p className="mb-3 uppercase text-gray-600 dark:text-gray-400 text-xs">
                    Original Image
                  </p>
                </div>
                <ImageWithFallback
                  src={originalImage.url}
                  alt={originalImage.filename}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <p className="text-gray-800 dark:text-gray-200">{originalImage.filename}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {similarImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(`/image/${image.id}`)}
                    className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={image.thumbnail_url}
                        alt={image.filename}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <div
                          className="px-3 py-1.5 rounded-full text-white text-xs"
                          style={{
                            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
                          }}
                        >
                          {Math.round(image.similarity_percentage)}% Match
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-800 dark:text-gray-200">{image.display_name || image.filename}</p>
                      <div className="mt-3 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${image.similarity_percentage}%` }}
                          transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                          className="h-full"
                          style={{
                            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
