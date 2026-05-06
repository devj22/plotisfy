import { Link } from "wouter";
import { MapPin, Ruler, LayoutGrid, Trees } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { 
    id, 
    title, 
    price, 
    location, 
    size, 
    sizeUnit, 
    features, 
    images, 
    videoUrl,
    isFeatured,
    propertyType,
    priceUnit 
  } = property;

  // Format price in Indian currency format or display text-based price
  const formatPrice = (price: string | number) => {
    if (typeof price === 'string') {
      return price;
    }

    if (price === 0) {
      return "Call for Price";
    }

    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lac`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  // Default image if none available
  const imageUrl = images && images.length > 0 
    ? images[0] 
    : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80";

  return (
    <Card className="h-full">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {isFeatured && (
            <span className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm">
              Featured
            </span>
          )}
          {propertyType && (
            <span className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {propertyType}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className="text-primary font-bold">
            {formatPrice(price)}{priceUnit ? ` per ${priceUnit}` : ''}
          </span>
        </div>
        
        <p className="text-gray-500 mb-4 flex items-center">
          <MapPin className="h-4 w-4 mr-2" /> {location}
        </p>
        
        <div className="flex justify-between text-sm text-gray-600 mb-6">
          <span className="flex items-center">
            <Ruler className="h-4 w-4 mr-1" /> {size} {sizeUnit}
          </span>
          {features && features.length > 0 && (
            <>
              <span className="flex items-center">
                <LayoutGrid className="h-4 w-4 mr-1" /> {features[0]}
              </span>
              {features.length > 1 && (
                <span className="flex items-center">
                  <Trees className="h-4 w-4 mr-1" /> {features[1]}
                </span>
              )}
            </>
          )}
        </div>
        
        <Link href={`/properties/${id}`} className="block text-center bg-white text-primary border border-primary py-2 rounded-md hover:bg-primary hover:text-white transition">
          View Details
        </Link>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;