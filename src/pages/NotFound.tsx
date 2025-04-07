
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';

const NotFound = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-cinema-red mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-medium text-cinema-white mb-6">Page Not Found</h2>
        <p className="text-cinema-gray max-w-md mb-8">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        <Link to="/">
          <Button className="bg-cinema-red hover:bg-opacity-90">
            Return to Home
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default NotFound;
