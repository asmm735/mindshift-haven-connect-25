
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, User } from "lucide-react";
import { Link } from "react-router-dom";

type ReviewData = {
  id: string;
  user_id: string;
  content: string;
  rating: number | null;
  created_at: string;
};

const HomeReviewsSection = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  const fetchReviews = async () => {
    const { data, error } = await (supabase as any)
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4);
    if (!error && data) setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < count ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
      />
    ));
  };

  return (
    <section className="py-16 bg-mindshift-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-mindshift-raspberry mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from people who have found support through MindShift.
          </p>
        </div>
        
        <Card className="mindshift-card">
          <CardHeader>
            <CardTitle className="text-2xl text-mindshift-raspberry">Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to share your experience!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-2 mb-3">
                      <User size={20} className="text-mindshift-raspberry" />
                      <div className="flex items-center">
                        {review.rating && renderStars(review.rating)}
                      </div>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">{review.content}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild variant="outline" className="mindshift-button">
              <Link to="/reviews">See More Reviews</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default HomeReviewsSection;
