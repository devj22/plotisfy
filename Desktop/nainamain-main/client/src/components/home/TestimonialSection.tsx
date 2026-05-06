import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    content: "Nainaland Deals made my dream of owning a plot in Panvel come true. The team was professional, transparent, and very helpful throughout the process.",
    author: "Rohit Sharma",
    location: "Navi Mumbai",
    rating: 5
  },
  {
    content: "I was nervous about legal issues, but Nainaland Deals handled everything smoothly. I bought land in Khalapur with complete confidence.",
    author: "Priya Desai",
    location: "Pune",
    rating: 5
  },
  {
    content: "Great experience! The team helped me find a great investment opportunity in Karjat. Highly recommend their services.",
    author: "Vikram Joshi",
    location: "Thane",
    rating: 5
  },
  {
    content: "Professional service, clear documentation, and great property options. Nainaland Deals is definitely one of the best in the region.",
    author: "Meera Patil",
    location: "Mumbai",
    rating: 5
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our satisfied clients about their experience with Nainaland Deals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold">— {testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
