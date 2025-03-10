import { useEffect, useState } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {getCategoryDropDown} from "@/Api/Admin/productApi.js"
import {getBrandsDropDown} from "@/Api/Admin/productApi.js"

const Filter = ({ isOpen, onClose, onApply, initialFilters = {} }) => {
    // Local state for filters
  
    const [selectedBrands, setSelectedBrands] = useState(initialFilters.brands || [])
    const [sortBy, setSortBy] = useState(initialFilters.sortBy || "popularity")
    const [brands,setBrands] = useState([]);

    const sortingOptions = [
      { value: "priceLowToHigh", label: "Price: Low to High" },
      { value: "priceHighToLow", label: "Price: High to Low" },
      { value: "popularity", label: "Popularity" },
      { value: "newArrivals", label: "New Arrivals" },
      { value: "AtoZ", label: "A to Z" },
      { value: "ZtoA", label: "Z to A" },
    ]
    
    //to get brand
    const fetchBrands = async () => {
        try{
            const data = await getBrandsDropDown();

            setBrands(data.brands);
        }
        catch(error){
            console.log("Failed to fetch brands",error)
        }
    }

    useEffect(() => {
        fetchBrands();
    }, []);
  
  
    const toggleBrand = (brandId) => {
      setSelectedBrands((prev) =>
        prev.includes(brandId)
          ? prev.filter((id) => id !== brandId)
          : [...prev, brandId]
      )
    }
  
    const handleApply = () => {
      const filters = {
        brands: selectedBrands,
        sortBy,
      }
      onApply(filters)
      onClose()
    }
  

    const handleReset = () => {

      setSelectedBrands([]);
      setSortBy("newArrivals");
    }
  
    const getSelectedCount = () => {
      return selectedBrands.length
    }
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={onClose}
            />
  
            {/* Filter Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-full sm:w-80 md:w-96 bg-background z-50 shadow-xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Filters</h2>
                    {getSelectedCount() > 0 && (
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {getSelectedCount()}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
  
                {/* Filter Content */}
                <ScrollArea className="flex-1 p-4">
                  <Accordion type="multiple" defaultValue={["categories", "brands", "sort"]}>  
                    {/* Brands */}
                    <AccordionItem value="brands">
                      <AccordionTrigger className="text-base font-medium">
                        Brands
                        {selectedBrands.length > 0 && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                            ({selectedBrands.length} selected)
                          </span>
                        )}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-1">
                          {brands.map((brand) => (
                            <div key={brand._id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`brand-${brand._id}`}
                                checked={selectedBrands.includes(brand._id)}
                                onCheckedChange={() => toggleBrand(brand._id)}
                              />
                              <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">
                                {brand.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
  
                    {/* Sort By */}
                    <AccordionItem value="sort">
                      <AccordionTrigger className="text-base font-medium">Sort By</AccordionTrigger>
                      <AccordionContent>
                        <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-2 pt-1">
                          {sortingOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
                              <Label htmlFor={`sort-${option.value}`} className="text-sm font-normal cursor-pointer">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </ScrollArea>
  
                {/* Footer */}
                <div className="border-t p-4 space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleReset}>
                      Reset
                    </Button>
                    <Button className="flex-1 gap-1" onClick={handleApply}>
                      Apply
                      {getSelectedCount() > 0 && (
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white text-primary text-xs font-medium">
                          {getSelectedCount()}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>  
        )}
      </AnimatePresence>
    )
  }
  
  export default Filter