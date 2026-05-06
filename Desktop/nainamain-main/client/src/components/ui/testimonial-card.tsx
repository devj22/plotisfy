import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "@shared/schema";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const { name, location, message, rating, image } = testimonial;
  
  // Convert rating to stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i 
          key={`star-${i}`} 
          className="fas fa-star text-yellow-400"
          aria-hidden="true"
        />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <i 
          key="half-star" 
          className="fas fa-star-half-alt text-yellow-400"
          aria-hidden="true"
        />
      );
    }
    
    // Add empty stars to make 5 stars total
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i 
          key={`empty-star-${i}`} 
          className="far fa-star text-yellow-400"
          aria-hidden="true"
        />
      );
    }
    
    return (
      <div className="flex items-center gap-1" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
        {stars}
      </div>
    );
  };

  const defaultImage = '/images/default-avatar.png';
  const imageUrl = image || defaultImage;

  return (
    <Card className="bg-[#F8F8F8] p-8 rounded-lg h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="text-[#FF6B35] mb-4">
          {renderStars(rating)}
        </div>
        
        <p className="text-gray-600 mb-6 flex-1 italic">"{message}"</p>
        
        <div className="flex items-center mt-auto">
          <div 
            className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200 flex-shrink-0"
            style={{ minWidth: '3rem' }}
          >
            <img 
              src={imageUrl}
              alt={`${name}'s profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultImage;
              }}
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium truncate">{name}</h4>
            <p className="text-gray-500 text-sm truncate">{location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
