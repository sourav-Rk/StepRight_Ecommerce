import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Link, useNavigate } from "react-router-dom";

export default function FAQPage() {
  const navigate = useNavigate();
  // FAQ data organized by categories
  const faqCategories = [
    {
      category: "Products & Sizing",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How do I find the right shoe size?",
          answer:
            "STEPRIGHT shoes typically run true to size. We recommend measuring your foot length and referring to our size chart available on each product page. If you're between sizes, we suggest going up a half size for a more comfortable fit.",
        },
        {
          question: "What materials are used in STEPRIGHT shoes?",
          answer:
            "We use a variety of high-quality materials including genuine leather, sustainable canvas, recycled rubber for soles, and eco-friendly textiles. Each product page specifies the exact materials used for that particular model.",
        },
        {
          question: "Are STEPRIGHT shoes suitable for wide feet?",
          answer:
            "Yes! We offer many styles in wide width options. Look for the 'W' designation in the size dropdown on product pages. Our comfort line is also designed with a roomier toe box to accommodate wider feet.",
        },
        {
          question: "Do you offer vegan shoe options?",
          answer:
            "Our EcoStep collection features 100% vegan materials with no animal products. These shoes are clearly labeled with our 'Vegan Friendly' badge on the product page.",
        },
      ],
    },
    {
      category: "Shipping & Returns",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping typically takes 3-5 business days within the continental US. Express shipping (1-2 business days) is available for an additional fee. International shipping times vary by location, generally taking 7-14 business days.",
        },
        {
          question: "What is your return policy?",
          answer:
            "We offer a 7-day return policy for unworn shoes in their original packaging. Returns are free for customers in the United States. Simply initiate a return through your account dashboard or contact our customer service team.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location. You can view the specific rates for your country during checkout.",
        },
        {
          question: "Can I exchange my shoes for a different size?",
          answer:
            "Yes, exchanges are easy! You can request an exchange through your account or contact our customer service team. We'll send you the new size as soon as we receive your return, or immediately if the item is in stock and you prefer an expedited exchange.",
        },
      ],
    },
    {
      category: "Company Information",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "Who is the CEO of STEPRIGHT?",
          answer:
            "Sourav k is the founder and CEO of STEPRIGHT. After working in the footwear industry for over 15 years, Sourav founded STEPRIGHT in 2010 with a mission to create stylish, comfortable shoes at accessible prices.",
        },
        {
          question: "Where is STEPRIGHT headquartered?",
          answer:
            "Our headquarters is located in Kadirur, Kannur, a city known for its footwear innovation. ",
        },
        {
          question: "Is STEPRIGHT committed to sustainability?",
          answer:
            "Sustainability is at the core of our mission. We use recycled and sustainable materials whenever possible, have reduced our packaging waste by 70% since 2018, and are committed to carbon-neutral shipping. Our EcoStep line is made from 90% recycled materials.",
        },
        {
          question: "Does STEPRIGHT have physical stores?",
          answer:
            "Yes, we currently have 25 retail locations across the kannur. You can find your nearest store using the Store Locator on our website. We're also available in select department stores and boutiques nationwide.",
        },
      ],
    },
    {
      category: "Orders & Account",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How do I track my order?",
          answer:
            "Once your order ships, you'll receive a confirmation email with tracking information. You can also view your order status by logging into your account and visiting the 'Order History' section.",
        },
        {
          question: "Can I modify or cancel my order?",
          answer:
            "Orders can be modified or canceled within 1 hour of placement. Please contact our customer service team immediately if you need to make changes. Once an order has entered the fulfillment process, we cannot guarantee changes can be made.",
        },
        {
          question: "Do I need an account to make a purchase?",
          answer:
            "No, you can check out as a guest. However, creating an account allows you to track orders, save favorite styles, and earn rewards points with each purchase.",
        },
        {
          question: "Is there a loyalty program?",
          answer:
            "Yes! Our StepRewards program gives you points for every purchase, which can be redeemed for discounts on future orders. Members also get early access to new releases and exclusive promotions.",
        },
      ],
    },
    {
      category: "Payment & Security",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. We also offer financing options through Affirm for orders over $100.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Absolutely. We use industry-standard SSL encryption to protect your personal and payment information. We are PCI DSS compliant and never store your full credit card details on our servers.",
        },
        {
          question: "Do you offer price matching?",
          answer:
            "Yes, we offer price matching for identical products found at lower prices from authorized retailers. Submit your price match request through our customer service portal with a link to the competitor's listing.",
        },
        {
          question: "Can I use multiple discount codes?",
          answer:
            "Generally, only one discount code can be applied per order. However, StepRewards points can be used in combination with most promotional discounts.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about STEPRIGHT shoes, orders,
              shipping, and more.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="container mx-auto max-w-4xl px-4 py-12">
        {faqCategories.map((category, index) => (
          <div key={index} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              {category.icon}
              <h2 className="text-2xl font-bold">{category.category}</h2>
            </div>
            <Accordion
              type="single"
              collapsible
              className="border rounded-lg overflow-hidden"
            >
              {category.questions.map((faq, faqIndex) => (
                <AccordionItem
                  key={faqIndex}
                  value={`item-${index}-${faqIndex}`}
                >
                  <AccordionTrigger className="px-4 py-4 hover:bg-muted/50 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </section>

      {/* Contact Section */}
      <section className="bg-muted py-12">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our customer support team is here to help. Reach out to us and we'll
            get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="min-w-[180px]">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">STEPRIGHT</h2>
              <p className="text-gray-400">Walking with you since 2010</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/products"
                className="hover:text-primary transition-colors"
              >
                Products
              </Link>
              <Link
                href="/faq"
                className="hover:text-primary transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} STEPRIGHT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
