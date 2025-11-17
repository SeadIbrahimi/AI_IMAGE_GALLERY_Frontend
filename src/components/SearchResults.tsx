import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, X } from 'lucide-react';
import ImageCard from './ImageCard';

const mockImages = [
  {
    id: '1',
    filename: 'sunset_beach.jpg',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    tags: ['sunset', 'nature'],
    uploadTime: '2 hours ago',
    status: 'complete' as const
  },
  {
    id: '7',
    filename: 'ocean_sunset.jpg',
    url: 'https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=800',
    tags: ['sunset', 'ocean'],
    uploadTime: '3 days ago',
    status: 'complete' as const
  },
  {
    id: '8',
    filename: 'sunset_mountains.jpg',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tags: ['sunset', 'mountains'],
    uploadTime: '1 week ago',
    status: 'complete' as const
  },
  {
    id: '9',
    filename: 'tropical_sunset.jpg',
    url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
    tags: ['sunset', 'tropical'],
    uploadTime: '2 weeks ago',
    status: 'complete' as const
  }
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const handleImageClick = (id: string) => {
    navigate(`/image/${id}`);
  };

  const handleClearSearch = () => {
    navigate('/gallery');
  };

  return (
    <div className="min-h-screen" style={{ background: '#F7FAFC' }}>
      <div className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="container mx-auto px-8 py-4 flex items-center justify-between">
          <Button
            onClick={() => navigate('/gallery')}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ color: '#2D3748' }}>
              Results for "{query}"
            </h1>
            <p className="mt-2" style={{ color: '#718096' }}>
              {mockImages.length} images found
            </p>
          </div>
          <Button
            onClick={handleClearSearch}
            variant="outline"
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear Search
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockImages.map(image => (
            <ImageCard
              key={image.id}
              image={image}
              onClick={() => handleImageClick(image.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
