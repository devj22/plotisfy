import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Building2, Trees } from "lucide-react";

const locations = [
  {
    name: "Panvel",
    description: "The gateway to Navi Mumbai, Panvel offers excellent connectivity and is set to become a major commercial hub with the new airport and metro connectivity.",
    icon: Building2,
    highlights: ["New Airport Development", "Metro Connectivity", "Commercial Hub"]
  },
  {
    name: "Khalapur",
    description: "Known for its scenic beauty and proximity to Mumbai-Pune Expressway, Khalapur presents unique investment opportunities in residential and commercial developments.",
    icon: MapPin,
    highlights: ["Mumbai-Pune Expressway", "Scenic Location", "Growing Infrastructure"]
  },
  {
    name: "Karjat",
    description: "A perfect blend of urban convenience and natural beauty, Karjat is emerging as a preferred destination for weekend homes and long-term investments.",
    icon: Trees,
    highlights: ["Natural Beauty", "Weekend Homes", "Investment Growth"]
  }
];

const AboutSection = () => {
  return (
    <section className="py-16 bg-white" id="about">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Prime Locations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover premium investment opportunities in Mumbai's fastest-growing regions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {locations.map((location, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 border-none bg-gray-50 overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <location.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">{location.name}</h3>
                <p className="text-gray-600 mb-6 text-center leading-relaxed">
                  {location.description}
                </p>
                <div className="space-y-2">
                  {location.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-primary/60 rounded-full"></span>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
