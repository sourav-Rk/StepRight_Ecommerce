import React, { useState } from "react";
import { FaShoePrints } from "react-icons/fa";
import { Star, Truck, ClipboardCheck, Heart, ChevronDown } from "lucide-react";

const AccordionItem = ({ icon: Icon, title, content, isOpen, onToggle }) => {
  return (
    <div className="border-b border-black/10">
      <button
        onClick={onToggle}
        className="group w-full bg-gray-800 p-4 flex items-center justify-between transition-colors hover:bg-white hover:border hover:border-black"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-white group-hover:text-black" />
          <span className="font-bold text-lg text-white group-hover:text-black">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform text-white group-hover:text-black ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="p-4 bg-white">
          {content}
        </div>
      </div>
    </div>
  );
};

const InfoAccordion = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      icon: Star,
      title: "Available Offers",
      content: (
        <ul className="space-y-3 text-LG">
          <li>
            1. Use Coupon Code <span className="font-bold">STEPRIGHT150</span> for additional Rs.150 discount on minimum purchase of Rs.1199.
          </li>
          <li>
            2. Flat Rs.1000 instant off on a minimum purchase of Rs.4998. Use Code: <span className="font-BOLD">STEPRIGHT1000</span> on checkout page.
          </li>
          <li>
            3. 5% extra instant discount on all Prepaid orders. Use Code: <span className="font-semibold">PREPAID5</span>
          </li>
          <li>
            4. Use coupon code: <span className="font-bold">STEPRIGHT250</span> to get Rs.250 instant discount valid on a minimum purchase of Rs.2498.
          </li>
          <li>
            5. Get Rs.500 off on a minimum purchase of Rs.3998. Use Code: <span className="font-bold">STEPRIGHT500</span>
          </li>
          <li>
            6. Rs.2500 OFF on purchase of Rs.9990. Use code: <span className="font-bold">STEPRIGHT2500</span>
          </li>
        </ul>
      ),
    },
    {
      icon: Truck,
      title: "Shipping Time",
      content: (
        <p className="text-sm">
          Standard delivery time is 2-3 business days for metro cities and 3-4 business days for other locations.
        </p>
      ),
    },
    {
      icon: FaShoePrints,
      title: "Size Guide",
      content: (
        <div className="text-sm">
          <p className="mb-2 text-xl">We follow Mens UK/INDIAN size charts while making our products.</p>
          <ul className="space-y-1 text-lg">
            <li>6UK = 40EUR = 7US</li>
            <li>7UK = 41EUR = 8US</li>
            <li>8UK = 42EUR = 9US</li>
            <li>10UK = 44EUR = 11US</li>
            <li>11UK = 45EUR = 12US</li>
          </ul>
        </div>
      ),
    },
    {
      icon: ClipboardCheck,
      title: "Care Instructions",
      content: (
        <p className="text-lg">Our Sneakers are highly durable and versatile for everyday styling.
           Use a damp cloth to clean your sneakers, for shinning the outsole use 
           a professional cleaner or toothpaste on the outsole to maintain whiteness.</p>
      ),
    },
    {
      icon: Heart,
      title: "Easy Returns & Exchange",
      content: (
        <div className="text-sm">
          <p className="text-lg">We offer hassle-free returns and exchanges within 30 days of delivery.</p>
          <ul className="mt-2 space-y-1 text-lg">
            <li>• Item must be unused and in original condition</li>
            <li>• Original packaging required</li>
            <li>• Free pickup service available</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 mt-10">
      <div className="rounded-lg overflow-hidden">
        {sections.map((section, index) => (
          <AccordionItem
            key={index}
            icon={section.icon}
            title={section.title}
            content={section.content}
            isOpen={openSection === index}
            onToggle={() => toggleSection(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default InfoAccordion;
