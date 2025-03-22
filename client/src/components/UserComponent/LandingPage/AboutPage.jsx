import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, MapPin, Users, Award } from "lucide-react";

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src="/aboutPAge.webp"
          alt="Shoes collection"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Our STEPRIGHT Story
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
            Walking with you on every journey since 2010
          </p>
        </div>
      </section>

      {/* Navigation Button */}
      <div className="container mx-auto px-4 py-6">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Journey of STEPRIGHT
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Founded in 2010, STEPRIGHT began with a simple mission: to create
              shoes that combine style, comfort, and quality at accessible
              prices.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              What started as a small boutique in downtown has now grown into a
              nationwide brand trusted by thousands of customers who value both
              fashion and functionality in their footwear.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">12+</span>
                <span className="text-sm text-muted-foreground text-center">
                  Years of Excellence
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">50k+</span>
                <span className="text-sm text-muted-foreground text-center">
                  Happy Customers
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">200+</span>
                <span className="text-sm text-muted-foreground text-center">
                  Shoe Designs
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">25+</span>
                <span className="text-sm text-muted-foreground text-center">
                  Store Locations
                </span>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            <img
              src="/StepRightLogo.png"
              alt="Our store"
              className="object-scale-down rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Craftsmanship</h3>
              <p className="text-muted-foreground">
                We use premium materials and employ skilled artisans to create
                shoes that are built to last.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Style & Comfort</h3>
              <p className="text-muted-foreground">
                We believe you shouldn't have to choose between looking good and
                feeling good. Our designs prioritize both.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customer First</h3>
              <p className="text-muted-foreground">
                Your satisfaction drives everything we do, from product design
                to after-sales service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Meet Our Team
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          The passionate individuals behind STEPRIGHT who work tirelessly to
          bring you the perfect shoes for every occasion.
        </p>
        <div className="grid md:grid-cols-2  ml-96">
          {[{ name: "Sourav k ", role: "Founder & CEO" }].map(
            (member, index) => (
              <div key={index} className="group">
                <div className="relative h-80 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={`/souravabout.jpg`}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Find Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6733.267443179585!2d75.52718185964865!3d11.786022903530299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba428ab740cf983%3A0xa05c1a4478c76dc2!2sKadirur%2C%20Kerala%20670642!5e1!3m2!1sen!2sin!4v1742636978349!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: "0" }} // ✅ Use object syntax in JSX
                allowFullScreen // ✅ CamelCase in JSX
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Our Flagship Stores</h3>
              <div className="space-y-6">
                {[
                  { city: "kannur", address: "Caltex , kannur" },
                  { city: "Thalassery", address: "Hospital road Thalassery" },
                  { city: "Bangalore", address: "Kormangala,banglore" },
                ].map((location, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold">{location.city}</h4>
                      <p className="text-muted-foreground">
                        {location.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Step Into Comfort & Style
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Browse our latest collection and find the perfect pair for your next
          adventure.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/shop-all")}
            size="lg"
            className="min-w-[150px]"
          >
            Shop Now
          </Button>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="min-w-[150px]">
              Contact Us
            </Button>
          </Link>
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
            <div className="flex gap-8">
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
