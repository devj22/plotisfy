import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type ContactFormValues = InsertMessage;

const ContactSection = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      message: "",
      interest: "other"
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      console.log('Submitting message:', values);
      try {
        const response = await apiRequest('POST', '/api/messages', values);
        console.log('Message submission response:', response);
        return response;
      } catch (error) {
        console.error('Message submission error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Message submitted successfully:', data);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset({
        name: "",
        email: "",
        phone: "",
        location: "",
        message: "",
        interest: "other"
      });
      setSubmitting(false);
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    },
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      setSubmitting(true);
      await mutation.mutateAsync(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

  return (
    <section className="py-20 bg-[#F8F8F8]" id="contact">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-stretch gap-12">
          <div className="lg:w-1/2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our properties or need expert advice? Fill out the form below and our team will get back to you promptly.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
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
                          <Input placeholder="Enter your location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your interest" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="mysore">Mysore</SelectItem>
                          <SelectItem value="hassan">Hassan</SelectItem>
                          <SelectItem value="chikmagalur">Chikmagalur</SelectItem>
                          <SelectItem value="other">Other Location</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your message" 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="lg:w-1/2 flex flex-col">
            <div className="bg-primary text-white p-8 rounded-lg shadow-md mb-8 flex-1">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-4 text-[#FF6B35]"></i>
                  <p>
                    #123, Brigade Road, <br />
                    Bangalore, Karnataka - 560001, <br />
                    India
                  </p>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-phone-alt mr-4 text-[#FF6B35]"></i>
                  <p>+91 98765 43210</p>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-envelope mr-4 text-[#FF6B35]"></i>
                  <p>info@nainalanddeals.com</p>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-clock mr-4 text-[#FF6B35]"></i>
                  <p>Monday - Saturday: 9 AM - 6 PM</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-white hover:text-[#FF6B35] transition">
                    <i className="fab fa-facebook-f text-xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-[#FF6B35] transition">
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-[#FF6B35] transition">
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-[#FF6B35] transition">
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-[#FF6B35] transition">
                    <i className="fab fa-youtube text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Schedule a Visit</h3>
              <p className="text-gray-600 mb-6">
                Want to visit our properties in person? Schedule a site visit with our property experts.
              </p>
              <Button className="inline-block bg-[#FF6B35] text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition">
                Book Site Visit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
