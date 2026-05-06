import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/ui/property-card";
import { Property } from "@shared/schema";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PropertiesPage = () => {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  
  const [filters, setFilters] = useState({
    location: "Any Location",
    searchTerm: ""
  });
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['properties'],
    initialData: [], // Initialize with empty array
  });
  
  // Filter properties based on selected filters
  const filteredProperties = properties?.filter(property => {
    if (!property) return false; // Skip if property is undefined
    
    // Filter by location (if not "Any Location")
    if (filters.location !== "Any Location" && !property.location.includes(filters.location)) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm && !property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
       !property.location.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }) || []; // Provide empty array as fallback
  
  // Format price for display with text-based values
  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') {
      return price; // Return text-based price as is
    }
    
    if (typeof price === 'number') {
      if (price >= 10000000) {
        return `${(price / 10000000).toFixed(1)} Cr`;
      } else if (price >= 100000) {
        return `${(price / 100000).toFixed(1)} Lac`;
      } else if (price === 0) {
        return "Call for Price";
      } else {
        return `₹${price.toLocaleString('en-IN')}`;
      }
    }
    
    return "Call for Price";
  };
  
  const handleLocationChange = (value: string) => {
    setFilters({...filters, location: value});
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({...filters, searchTerm: e.target.value});
  };
  
  const resetFilters = () => {
    setFilters({
      location: "Any Location",
      searchTerm: ""
    });
  };

  return (
    <>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Perfect Land</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our extensive portfolio of premium land properties and find the perfect investment opportunity.
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <Input 
                  type="text" 
                  placeholder="Search by title or location" 
                  value={filters.searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Select 
                  value={filters.location} 
                  onValueChange={handleLocationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Location">Any Location</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Mysore">Mysore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Property Listings */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isLoading ? "Loading properties..." : 
               filteredProperties?.length ? `${filteredProperties.length} Properties Found` : 
               "No properties match your criteria"}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>Error loading properties. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties && filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={{
                      ...property,
                      price: property.price === 0 ? "Call for Price" : 
                             typeof property.price === 'string' ? property.price :
                             formatPrice(property.price)
                    }} 
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-16 bg-white rounded-lg shadow-sm">
                  <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                  <Button onClick={resetFilters} className="mt-4 bg-primary">
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PropertiesPage;
