import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  const faqs = [
    {
      question: "What makes Panvel, Khalapur, and Karjat good investment locations?",
      answer: "These regions offer excellent investment potential due to their proximity to Mumbai, upcoming infrastructure projects, and rapid development. Panvel is becoming a major commercial hub, Khalapur offers scenic residential plots, and Karjat is emerging as a preferred destination for weekend homes and long-term investments."
    },
    {
      question: "What documents do I need to buy land in these regions?",
      answer: "You'll need your government-issued ID proof, address proof, and income tax returns. For the property, you'll need the title deed, property tax receipts, and encumbrance certificate. We'll guide you through all necessary documentation specific to these regions."
    },
    {
      question: "How do I verify the land title in Panvel/Khalapur/Karjat?",
      answer: "We conduct thorough due diligence including title verification, encumbrance certificate check, and property tax verification. We also ensure there are no legal disputes or pending litigations on the property, which is crucial in these rapidly developing areas."
    },
    {
      question: "What are the common pitfalls in land buying in these regions?",
      answer: "Common pitfalls include unclear titles, boundary disputes, and lack of proper documentation. We help you avoid these by conducting comprehensive property checks and ensuring all legal requirements are met, especially important in these developing areas."
    },
    {
      question: "How long does the land buying process take?",
      answer: "The process typically takes 2-3 months from initial selection to final registration. This includes property verification, documentation, and legal formalities. We ensure a smooth and efficient process."
    },
    {
      question: "What are the additional costs involved?",
      answer: "Additional costs include registration charges, stamp duty, property tax, and legal fees. We provide a detailed breakdown of all costs involved before you make a decision, specific to the region you're interested in."
    },
    {
      question: "Do you help with property loans for these regions?",
      answer: "Yes, we have tie-ups with leading banks and financial institutions. We can help you understand various loan options and guide you through the loan application process, with specific knowledge of lending policies in Panvel, Khalapur, and Karjat."
    },
    {
      question: "What after-sales support do you provide?",
      answer: "We provide comprehensive after-sales support including assistance with property registration, utility connections, and guidance on property development. Our relationship doesn't end with the sale, and we continue to support you in these growing regions."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-center mb-12">
            Find answers to common questions about land buying in Panvel, Khalapur, and Karjat
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button 
              onClick={() => window.location.href = '/#contact'} 
              className="bg-primary text-white hover:bg-opacity-90"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage; 