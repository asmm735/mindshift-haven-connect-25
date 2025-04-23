
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Review = {
  id: string;
  user_id: string;
  content: string;
  rating: number;
  created_at: string;
};

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canPost, setCanPost] = useState(false);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCanPost(!!session?.user);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setCanPost(!!session?.user);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !rating) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      content,
      rating,
      // user_id set by RLS
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Failed to submit review", description: error.message, variant: "destructive" });
    } else {
      setContent("");
      setRating(5);
      toast({ title: "Thank you!", description: "Your review has been submitted." });
      fetchReviews();
    }
  };

  return (
    <Card className="mindshift-card my-8">
      <CardHeader>
        <CardTitle className="text-2xl text-mindshift-raspberry">Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-mindshift-raspberry">{Array(review.rating).fill("★").join("")}</span>
                  <span className="text-xs text-gray-500 ml-2">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <div className="mt-1 text-sm">{review.content}</div>
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
              <Input
                type="number"
                value={rating}
                min={1}
                max={5}
                onChange={e => setRating(Number(e.target.value))}
                className="w-16"
                required
              />
              <Button type="submit" disabled={isSubmitting} className="ml-auto mindshift-button">{isSubmitting ? "Submitting..." : "Submit Review"}</Button>
            </div>
          </form>
        </CardFooter>
      )}
      {!canPost && (
        <CardFooter>
          <div className="text-sm text-gray-500">
            Please sign in to write a review.
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReviewsSection;
