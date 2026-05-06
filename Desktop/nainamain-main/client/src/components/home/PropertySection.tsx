import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/ui/property-card";
import { Property } from "@shared/schema";
import useEmblaCarousel from 'embla-carousel-react';

const PropertySection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', containScroll: 'trimSnaps' });
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-16 bg-[#F8F8F8]" id="properties">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our hand-picked selection of premium land properties for your next investment.
          </p>
        </div>

        {/* Property listings carousel */}
        {isLoading ? (
          <div className="text-center py-10">Loading properties...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error loading properties</div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {properties?.map((property) => (
                  <div key={property.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4">
                    <PropertyCard property={property} />
                  </div>
                )) || (
                  <div className="flex-full text-center py-10 px-4">
                    No properties found.
                  </div>
                )}
              </div>
            </div>

            {properties && properties.length > 1 && (
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
                  onClick={scrollPrev}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
                  onClick={scrollNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertySection;
