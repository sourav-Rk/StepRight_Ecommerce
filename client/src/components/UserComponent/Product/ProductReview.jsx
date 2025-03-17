import { useState, useEffect } from "react"
import { Star, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { addReview, getReviews } from "@/Api/User/reviewApi"
import { message } from "antd"

function ProductReviews({ productId,setReviewCount }) {
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({
    rating: 0,
    reviewText: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0);

  //to fetch the reviews
  const fetchReviews = async() => {
    try{
        const response = await getReviews(productId);
        setReviews(response.reviews);
        setReviewCount(response.reviews.length);
    }
    catch(error){
        message.error(error?.message)
    }
  }

  useEffect(() => {
     fetchReviews()
  }, [productId])

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({
      ...prev,
      rating,
    }))
  }

  const handleReviewTextChange = (e) => {
    setNewReview((prev) => ({
      ...prev,
      reviewText: e.target.value,
    }))
  }
 

  //to handle review submit
  const handleSubmitReview = async(e) => {
    setIsSubmitting(true)
    try{
        e.preventDefault()
        const response = await addReview(productId,newReview.rating,newReview.reviewText);
        fetchReviews()
        message.success(response.message);
    }
    catch(error){
        console.log("Error in adding review",error);
        message.error(error?.message)
    }
    finally{
        setIsSubmitting(false)
        setNewReview({ rating: 0, reviewText: "" })
    }
    
  }


  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Product Reviews</h2>

      {/* Add Review Form */}
      <Card className="mb-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Write a Review</h3>
        </CardHeader>
        <form onSubmit={handleSubmitReview}>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => handleRatingChange(star)}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoveredRating || newReview.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {newReview.rating > 0 ? `${newReview.rating} out of 5 stars` : "Select a rating"}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="reviewText" className="block text-sm font-medium mb-2">
                Your Review
              </label>
              <Textarea
                id="reviewText"
                placeholder="Share your experience with this product..."
                value={newReview.reviewText}
                onChange={handleReviewTextChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Separator className="my-8" />

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Customer Reviews ({reviews.length})</h3>

        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{review.userId.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{review.userId.firstName}</h4>
                        <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{review.reviewText}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductReviews
