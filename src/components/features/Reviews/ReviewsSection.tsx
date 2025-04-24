import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, User } from "lucide-react";
import { Review } from "@/types/supabase-custom";

type ReviewData = {
  id: string;
  user_id: string;
  content: string;
  rating: number | null;
  created_at: string;
};

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canPost, setCanPost] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCanPost(true);
        setUserId(session.user.id);
      } else {
        setCanPost(false);
        setUserId(null);
      }
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCanPost(!!session?.user);
      setUserId(session?.user?.id || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !rating || !userId) {
      toast({ 
        title: !userId ? "Please sign in to post a review" : "Please fill all fields", 
        variant: "destructive" 
      });
      return;
    }
    
    setIsSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      content,
      rating,
      user_id: userId
    });
    setIsSubmitting(false);
    
    if (error) {
      toast({ 
        title: "Failed to submit review", 
        description: error.message, 
        variant: "destructive" 
      });
    } else {
      setContent("");
      setRating(5);
      toast({ 
        title: "Thank you!", 
        description: "Your review has been submitted." 
      });
      fetchReviews();
    }
  };

  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < count ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
      />
    ));
  };

  return (
    <Card className="mindshift-card my-8">
      <CardHeader>
        <CardTitle className="text-2xl text-mindshift-raspberry">Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-mindshift-raspberry" />
                  <div className="flex items-center">
                    {review.rating && renderStars(review.rating)}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 text-sm">{review.content}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {canPost && (
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <Textarea
              placeholder="Write your review…"
              value={content}
              onChange={e => setContent(e.target.value)}
              minLength={5}
              maxLength={500}
              required
            />
            <div className="flex items-center gap-2">
              <label>Rating:</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-5 w-5 cursor-pointer ${
                        star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Button type="submit" disabled={isSubmitting} className="ml-auto mindshift-button">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </CardFooter>
      )}
      {!canPost && (
        <CardFooter>
          <div className="text-sm text-gray-500">
            Please <a href="/login" className="text-mindshift-raspberry hover:underline">sign in</a> to write a review.
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReviewsSection;
