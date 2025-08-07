'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTestimonials } from '@/lib/query/hooks';

interface TestimonialProps {
  testimonial: {
    id: string;
    author: string;
    content: string;
    rating: number;
    date: string;
  };
}

function TestimonialCard({ testimonial }: TestimonialProps) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#162e77]/20 relative">
      {/* Quote icon */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
        <Quote className="w-8 h-8 text-[#162e77]" />
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < testimonial.rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-500 ml-2">
          {testimonial.rating}/5
        </span>
      </div>

      {/* Content */}
      <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 italic">
        "{testimonial.content}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#162e77] to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {testimonial.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">
              {testimonial.author}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(testimonial.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Verified badge */}
        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
          ✓ Vérifié
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { data: testimonials, isLoading, error } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonialsPerPage = 3;
  const totalSlides = Math.ceil((testimonials?.data?.length || 0) / testimonialsPerPage);

  useEffect(() => {
    if (!isAutoPlaying || !testimonials?.data?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides, testimonials?.data?.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <div key={starIndex} className="w-4 h-4 bg-gray-200 rounded" />
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-4" />
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600 mb-4">Erreur lors du chargement des témoignages</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  if (!testimonials?.data?.length) {
    return null;
  }

  const currentTestimonials = testimonials.data.slice(
    currentIndex * testimonialsPerPage,
    (currentIndex + 1) * testimonialsPerPage
  );

  // Calculate average rating
  const averageRating = testimonials.data.reduce((sum, testimonial) => sum + testimonial.rating, 0) / testimonials.data.length;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Ils parlent de KesiMarket.fr</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Découvrez ce que nos clients pensent de notre service et de notre plateforme
          </p>

          {/* Overall rating */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-6 h-6 ${
                    index < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {averageRating.toFixed(1)}/5
            </div>
            <div className="text-gray-500">
              Basé sur {testimonials.data.length} avis clients
            </div>
          </div>
        </div>

        {/* Testimonials carousel */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
            {currentTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          {/* Navigation arrows */}
          {totalSlides > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg border-gray-200 hover:border-[#162e77] hover:text-[#162e77] rounded-full w-12 h-12 p-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg border-gray-200 hover:border-[#162e77] hover:text-[#162e77] rounded-full w-12 h-12 p-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        {totalSlides > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#162e77] scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#162e77]">4.8/5</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#162e77]">98%</div>
              <div className="text-sm text-gray-600">Clients satisfaits</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#162e77]">500K+</div>
              <div className="text-sm text-gray-600">Commandes livrées</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#162e77]">24h</div>
              <div className="text-sm text-gray-600">Support réactif</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
