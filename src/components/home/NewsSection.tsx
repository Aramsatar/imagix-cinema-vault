
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

// Sample news data
const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "IMAGIX Cinema to Open New IMAX Theater",
    excerpt: "Experience movies like never before with our state-of-the-art IMAX theater opening next month.",
    date: "2025-04-15",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Exclusive Director's Cut Screenings Coming Soon",
    excerpt: "Join us for special screenings featuring extended cuts and commentary from acclaimed directors.",
    date: "2025-04-20",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Film Festival Highlights: Winners Announced",
    excerpt: "Discover the award-winning films coming to IMAGIX screens from this year's international film festival circuit.",
    date: "2025-04-25",
    image: "https://images.unsplash.com/photo-1569267590213-06ea85763db3?w=800&auto=format&fit=crop"
  }
];

const NewsSection = () => {
  return (
    <section className="cinema-section">
      <div className="cinema-container">
        <h2 className="section-title">Latest News</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-animation">
          {newsItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-cinema-card-bg border border-muted rounded-lg overflow-hidden opacity-0 animate-fade-in"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-center text-cinema-gray text-sm mb-2">
                  <Calendar size={14} className="mr-1" />
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                
                <h3 className="font-medium text-lg mb-2 text-cinema-white">{item.title}</h3>
                <p className="text-cinema-gray text-sm mb-4">{item.excerpt}</p>
                
                <Button variant="outline" className="w-full border-cinema-red text-cinema-red hover:bg-cinema-red/10">
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button variant="outline" className="border-cinema-red text-cinema-red hover:bg-cinema-red/10">
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
