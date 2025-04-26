
import { Card } from '@/components/ui/card';

interface MovieImagesProps {
  stills: string[];
}

const MovieImages = ({ stills }: MovieImagesProps) => {
  return (
    <>
      <h2 className="text-2xl font-medium mb-4 mt-8">Movie Stills</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stills.map((imageUrl, index) => (
          <Card key={index} className="overflow-hidden">
            <img
              src={imageUrl}
              alt={`Movie still ${index + 1}`}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
          </Card>
        ))}
      </div>
    </>
  );
};

export default MovieImages;
