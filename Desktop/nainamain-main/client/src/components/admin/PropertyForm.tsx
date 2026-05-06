import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { insertPropertySchema, Property } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeader } from "@/lib/auth";
import { Label } from "@/components/ui/label";

// Extend the property schema with form-specific fields
const propertyFormSchema = insertPropertySchema.extend({
  featuresString: z.string().optional(),
  imagesString: z.string().optional(),
  priceUnit: z.string(),
  videoUrl: z.string(),
}).omit({ features: true, images: true });

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  property?: Property;
  mode: "create" | "edit";
  onSuccess?: () => void;
}

const PropertyForm = ({ property, mode, onSuccess }: PropertyFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [isTextPrice, setIsTextPrice] = useState(property?.price === "Call for Price" || typeof property?.price === 'string');

  // Convert features array to comma-separated string
  const featuresToString = (features?: string[]) => {
    return features?.join(", ") || "";
  };

  // Convert images array to comma-separated string
  const imagesToString = (images?: string[]) => {
    return images?.join(", ") || "";
  };

  // Parse comma-separated string back to array
  const parseStringToArray = (str?: string) => {
    if (!str) return [];
    return str.split(",").map(item => item.trim()).filter(Boolean);
  };

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      price: property?.price?.toString() || (isTextPrice ? "Call for Price" : "0"),
      priceUnit: property?.priceUnit || "",
      location: property?.location || "",
      size: property?.size || 0,
      sizeUnit: property?.sizeUnit || "Guntha",
      featuresString: featuresToString(property?.features),
      imagesString: imagesToString(property?.images),
      videoUrl: property?.videoUrl || "",
      isFeatured: property?.isFeatured || false,
      propertyType: property?.propertyType || "Residential",
    },
  });

  useEffect(() => {
    if (property) {
      form.reset({
        title: property.title,
        description: property.description,
        price: property.price.toString(),
        priceUnit: property.priceUnit || "",
        location: property.location,
        size: property.size,
        sizeUnit: property.sizeUnit,
        featuresString: featuresToString(property.features),
        imagesString: imagesToString(property.images),
        videoUrl: property.videoUrl || "",
        isFeatured: property.isFeatured,
        propertyType: property.propertyType,
      });
      setIsTextPrice(property.price === "Call for Price" || typeof property.price === 'string');
    }
  }, [property, form]);

  const createPropertyMutation = useMutation({
    mutationFn: async (data: PropertyFormValues) => {
      const propertyData = {
        ...data,
        features: parseStringToArray(data.featuresString),
        images: parseStringToArray(data.imagesString),
        priceUnit: data.priceUnit || null,
        videoUrl: data.videoUrl || null,
        price: isTextPrice ? data.price : Number(data.price),
      };
      delete (propertyData as any).featuresString;
      delete (propertyData as any).imagesString;

      const response = await apiRequest("POST", "properties", propertyData, getAuthHeader());
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property",
        variant: "destructive",
      });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async (data: PropertyFormValues) => {
      if (!property?.id) throw new Error("Property ID is required for update");
      const propertyData = {
        ...data,
        features: parseStringToArray(data.featuresString),
        images: parseStringToArray(data.imagesString),
        priceUnit: data.priceUnit || null,
        videoUrl: data.videoUrl || null,
        price: isTextPrice ? data.price : Number(data.price),
      };
      delete (propertyData as any).featuresString;
      delete (propertyData as any).imagesString;

      const response = await apiRequest("PUT", `properties/${property.id}`, propertyData, getAuthHeader());
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update property",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: PropertyFormValues) => {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createPropertyMutation.mutateAsync(data);
      } else {
        await updatePropertyMutation.mutateAsync(data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Add New Property" : "Edit Property"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto pr-2 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Property title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Property location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isTextPrice}
                      onCheckedChange={setIsTextPrice}
                      id="text-price"
                    />
                    <Label htmlFor="text-price">Use text-based price</Label>
                  </div>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          {isTextPrice ? (
                            <Input 
                              placeholder="e.g., Call for Price, 74 Lac per Guntha" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                              value={typeof field.value === 'number' ? '' : field.value}
                            />
                          ) : (
                            <Input 
                              type="number" 
                              placeholder="Property price" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              value={typeof field.value === 'number' ? field.value : 0}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!isTextPrice && (
                    <FormField
                      control={form.control}
                      name="priceUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Unit</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., per Guntha, per Acre" 
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Property size" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sizeUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Guntha">Guntha</SelectItem>
                            <SelectItem value="Acres">Acres</SelectItem>
                            <SelectItem value="Sq.ft">Sq.ft</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Residential">Residential Plot</SelectItem>
                          <SelectItem value="Agricultural">Agricultural Land</SelectItem>
                          <SelectItem value="Commercial">Commercial Plot</SelectItem>
                          <SelectItem value="FarmHouse">Farm House</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Property</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Show this property on the homepage
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Property description" 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featuresString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (comma-separated)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="60 ft Road, BMRDA Approved, Corner Plot" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imagesString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URLs (comma-separated)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-base font-medium">YouTube Video URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=VIDEO_ID" 
                        className="w-full"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <div className="text-sm text-muted-foreground mt-2 p-2 bg-gray-50 rounded-md border border-gray-100">
                      <p className="mb-1">✓ Use regular YouTube URL format, for example:</p>
                      <code className="text-xs bg-gray-100 p-1 rounded">https://www.youtube.com/watch?v=VIDEO_ID</code>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 pt-6">
              <div className="flex justify-end gap-4">
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin mr-2">⌛</span>
                      {mode === "create" ? "Creating..." : "Updating..."}
                    </>
                  ) : (
                    <>{mode === "create" ? "Create Property" : "Update Property"}</>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
