import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderSummary({ products }) {
  const getTotalForProduct = (product) => product.price * product.quantity

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((item) => (
            <div key={item.product._id} className="flex gap-4">
              <img
                 src={item.product.images?.[0] || "/martin-katler-Y4fKN-RlMV4-unsplash.jpg"}
                alt={item.product.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm  text-blue-400">
                  ₹{item.price.toFixed(2)} 
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ₹{getTotalForProduct(item).toFixed(2)}
                </p>       
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
