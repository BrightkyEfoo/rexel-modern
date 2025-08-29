"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Check,
  MessageSquare,
  ThumbsUp,
  Edit,
  Trash2,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/nextauth-hooks";
import {
  useProductReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useMarkReviewHelpful,
} from "@/lib/hooks/useReviews";
import type { ProductReview } from "@/lib/api/types";

interface ProductReviewsProps {
  productId: string;
  className?: string;
}

export function ProductReviews({
  productId,
  className = "",
}: ProductReviewsProps) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const { data: reviewsData, isLoading } = useProductReviews(productId);
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();
  const markHelpfulMutation = useMarkReviewHelpful();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ProductReview | null>(
    null
  );
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());

  // Initialiser les votes depuis les données de l'API
  useEffect(() => {
    if (reviewsData?.data) {
      const userVotes = new Set<string>();
      reviewsData.data.forEach(review => {
        if (review.votes && review.votes.length > 0) {
          userVotes.add(review.id);
        }
      });
      setVotedReviews(userVotes);
    }
  }, [reviewsData?.data]);

  const reviews = reviewsData?.data || [];
  const stats = reviewsData?.meta;

  const averageRating = stats?.averageRating || 0;
  const totalReviews = stats?.total || 0;
  const ratingCounts = stats?.ratingCounts || [];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour laisser un avis",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingReview) {
        await updateReviewMutation.mutateAsync({
          id: editingReview.id.toString(),
          data: newReview,
        });
        toast({
          title: "Avis mis à jour",
          description: "Votre avis a été mis à jour avec succès",
        });
        setEditingReview(null);
      } else {
        await createReviewMutation.mutateAsync({
          productId: parseInt(productId),
          ...newReview,
        });
        toast({
          title: "Avis publié",
          description: "Votre avis a été publié avec succès",
        });
      }

      setShowReviewForm(false);
      setNewReview({ rating: 5, title: "", comment: "" });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleEditReview = (review: ProductReview) => {
    setEditingReview(review);
    setNewReview({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      return;
    }

    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      toast({
        title: "Avis supprimé",
        description: "Votre avis a été supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description:
          "Vous devez être connecté pour marquer un avis comme utile",
        variant: "destructive",
      });
      return;
    }

    // Vérifier si l'utilisateur a déjà voté pour cet avis
    if (votedReviews.has(reviewId)) {
      toast({
        title: "Déjà voté",
        description: "Vous avez déjà trouvé cet avis utile",
        variant: "destructive",
      });
      return;
    }

    try {
      await markHelpfulMutation.mutateAsync(reviewId);
      // Ajouter l'avis à la liste des avis votés
      setVotedReviews(prev => new Set(prev).add(reviewId));
      toast({
        title: "Merci !",
        description: "Votre vote a été pris en compte",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const userReview = reviews.find((review) => Number(review.userId) === Number(user?.id));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Avis clients ({totalReviews})
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.round(averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} sur 5 ({totalReviews} avis)
            </span>
          </div>
        </div>

        {/* Bouton "Laisser un avis" - seulement si connecté et n'a pas encore laissé d'avis */}
        {isAuthenticated && !userReview && (
          <Button onClick={() => setShowReviewForm(true)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Laisser un avis
          </Button>
        )}
      </div>

      {/* Répartition des notes */}
      {ratingCounts.length > 0 && (
        <div className="space-y-2 max-w-md">
          {ratingCounts.reverse().map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className="text-sm">{rating}</span>
                <StarIcon className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-12">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire d'avis */}
      {showReviewForm && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4">
              {editingReview ? "Modifier votre avis" : "Laisser un avis"}
            </h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label>Note</Label>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: index + 1 })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          index < newReview.rating
                            ? "text-yellow-400 fill-current"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview({ ...newReview, title: e.target.value })
                  }
                  placeholder="Titre de votre avis"
                  required
                />
              </div>

              <div>
                <Label htmlFor="comment">Commentaire</Label>
                <Textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder="Partagez votre expérience avec ce produit"
                  rows={4}
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={
                    createReviewMutation.isPending ||
                    updateReviewMutation.isPending
                  }
                >
                  {createReviewMutation.isPending ||
                  updateReviewMutation.isPending
                    ? "Envoi..."
                    : editingReview
                    ? "Mettre à jour"
                    : "Publier l'avis"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setEditingReview(null);
                    setNewReview({ rating: 5, title: "", comment: "" });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des avis */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-6 bg-muted rounded w-1/2 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => {
            const hasVoted = votedReviews.has(review.id.toString());
            
            return (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        {review.userName ||
                          `${review.user?.firstName} ${review.user?.lastName}`}
                      </span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Achat vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${
                              index < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                                             {Number(user?.id) === Number(review.userId) && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteReview(review.id.toString())
                            }
                            className="p-1 hover:bg-muted rounded text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-muted-foreground mb-3">{review.comment}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    <button
                      onClick={() => handleHelpful(review.id.toString())}
                      className={`flex items-center space-x-1 transition-colors ${
                        hasVoted
                          ? "text-primary cursor-not-allowed"
                          : "hover:text-primary"
                      }`}
                      disabled={hasVoted || markHelpfulMutation.isPending}
                    >
                      <ThumbsUp className={`w-4 h-4 ${hasVoted ? "fill-current" : ""}`} />
                      <span>
                        {review.helpfulCount || 0} personne{review.helpfulCount !== 1 ? 's' : ''} ont trouvé cet avis utile
                      </span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun avis pour le moment</p>
          <p className="text-sm">Soyez le premier à laisser un avis !</p>
          {!isAuthenticated && (
            <Button 
              className="mt-4" 
              onClick={() => window.location.href = '/auth/login'}
            >
              Se connecter pour laisser un avis
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
