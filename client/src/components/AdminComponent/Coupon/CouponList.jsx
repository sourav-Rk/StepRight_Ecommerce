"use client"

import { useState, useEffect } from "react"
import {
  PlusCircle,
  Search,
  ArrowUpDown,
  Calendar,
  Tag,
  ShoppingBag,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from "react-router-dom"
import { blockCoupon, getCoupons } from "@/Api/Admin/couponApi"
import { message } from "antd"

export default function CouponList() {
  const [coupons, setCoupons] = useState([])

  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async() => {
        try{
            const response = await getCoupons();
            setCoupons(response.coupons)
            console.log(response)
        }
        catch(error){
            console.log("Error in fetching coupons",error)
            message.error(error?.message)
        }
    }
    fetchCoupons()
  },[]);
 
  //to handle toggling of status
  const handleToggle = async(id) => {
    try{
        const response = await blockCoupon(id);
        message.success(response.message);

         // Update the UI immediately
        setCoupons(prevCoupons =>
            prevCoupons.map(coupon =>
            coupon._id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
            )
        );
    }
    catch(error){
       message.error(error?.message);
       console.log("Error in updating the status",error);
    }
  }

  const filteredCoupons = coupons.filter((coupon) => {
    // Filter by search term
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && coupon.isActive
    if (activeTab === "inactive")
      return matchesSearch && (!coupon.isActive)

    return matchesSearch
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const isExpiringSoon = (dateString) => {
    const expiryDate = new Date(dateString)
    const today = new Date()
    const diffTime = expiryDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 7
  }

  const getStatusBadge = (coupon) => {
    if (!coupon.isActive) {
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          Disabled
        </Badge>
      )
    }

    if (coupon.status === "expired") {
      return <Badge variant="destructive">Expired</Badge>
    }

    if (coupon.status === "exhausted") {
      return <Badge variant="destructive">Exhausted</Badge>
    }

    if (isExpiringSoon(coupon.expiryDate)) {
      return (
        <Badge variant="warning" className="bg-amber-500 hover:bg-amber-600">
          Expiring Soon
        </Badge>
      )
    }

    if (coupon.usageCount >= coupon.usageLimit * 0.9) {
      return (
        <Badge variant="warning" className="bg-amber-500 hover:bg-amber-600">
          Almost Exhausted
        </Badge>
      )
    }

    return (
      <Badge variant="success" className="bg-green-500 hover:bg-green-600">
        Active
      </Badge>
    )
  }

  const getDiscountDisplay = (coupon) => {
    if (coupon.discountType === "percentage") {
      return (
        <div className="flex items-center">
          <span>{coupon.discountValue}%</span>
        </div>
      )
    } else if (coupon.discountType === "amount") {
      return (
        <div className="flex items-center">

          <span>₹{coupon.discountValue}</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1 text-primary" />
          <span>Free Shipping</span>
        </div>
      )
    }
  }

  return (

    <div className="ml-64 max-w-[calc(100%-16rem)] mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Coupon Management</h1>
              <Button
               onClick={() => navigate("/admin/add/coupon")} 
               className="bg-primary hover:bg-primary/90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Coupon
              </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Coupons</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search coupons..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="overflow-hidden border rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">SL No</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Code
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Discount Type</th>
                   <th className="text-left p-4 font-medium text-muted-foreground">Discount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    <div className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Min Purchase
                    </div>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Expiry Date
                    </div>
                  </th>
                  {/* <th className="text-left p-4 font-medium text-muted-foreground">
                    <div className="flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Usage
                    </div>
                  </th> */}
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Enable</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCoupons.map((coupon, index) => (
                  <tr
                    key={coupon.id}
                    className={`hover:bg-muted/50 transition-colors ${!coupon.isActive ? "opacity-70" : ""}`}
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">
                      <div className="font-medium">{coupon.code}</div>
                    </td>
                    <td className="p-4">{coupon.discountType}</td>
                    <td className="p-4">{getDiscountDisplay(coupon)}</td>
                    <td className="p-4">{coupon.minimumPurchase}</td>
                    <td className="p-4">
                      <div
                        className={`${
                          isExpiringSoon(coupon.expiryDate)
                            ? "text-amber-600 font-medium"
                            : new Date(coupon.expiryDate) < new Date()
                              ? "text-destructive"
                              : ""
                        }`}
                      >
                        {formatDate(coupon.expiryDate)}
                      </div>
                    </td>
                    
                    <td className="p-4">{getStatusBadge(coupon)}</td>
                    <td className="p-4 text-center">
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={(checked) => handleToggle(coupon._id)}
                      />
                    </td>
                  </tr>
                ))}
                {filteredCoupons.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-muted-foreground">
                      No coupons found. Try adjusting your search or create a new coupon.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
