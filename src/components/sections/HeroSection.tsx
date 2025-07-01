'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Shield, Clock } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    title: 'Leader de la distribution professionnelle',
    subtitle: 'Plus de 2 millions de références pour vos projets électriques',
    description: 'Bénéficiez de prix personnalisés et d\'une expérience d\'achat simplifiée.',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&h=600&fit=crop',
    cta: {
      text: 'Je commande',
      href: '/register',
    },
    highlight: 'Nouveau',
  },
  {
    id: 2,
    title: 'Smart & Connective',
    subtitle: 'L\'avenir de l\'installation électrique',
    description: 'Découvrez nos solutions connectées pour des installations intelligentes.',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=600&fit=crop',
    cta: {
      text: 'Je découvre',
      href: '/smart-connective',
    },
    highlight: 'Innovation',
  },
  {
    id: 3,
    title: 'Rexel Expo 2024',
    subtitle: 'Le plus grand événement de l\'électricité',
    description: 'Rencontrez nos experts et découvrez les dernières innovations.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
    cta: {
      text: 'Je découvre',
      href: '/expo',
    },
    highlight: 'Événement',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function HeroSection() {
  const [[currentSlide, direction], setCurrentSlide] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(([prev, _]) => [(prev + 1) % heroSlides.length, 1]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    const direction = index > currentSlide ? 1 : -1;
    setCurrentSlide([index, direction]);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const paginate = (newDirection: number) => {
    setCurrentSlide(([prev, _]) => [(prev + newDirection + heroSlides.length) % heroSlides.length, newDirection]);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
      {/* Background image with overlay */}
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80" />

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-primary-foreground space-y-8"
          >
            {slide.highlight && (
              <Badge
                variant="secondary"
                className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30"
              >
                {slide.highlight}
              </Badge>
            )}

            <div className="space-y-4">
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl lg:text-6xl font-bold leading-tight"
              >
                {slide.title}
              </motion.h1>
              <motion.h2
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl lg:text-2xl text-primary-foreground/80 font-medium"
              >
                {slide.subtitle}
              </motion.h2>
              <motion.p
                key={`description-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg text-primary-foreground/80 max-w-lg"
              >
                {slide.description}
              </motion.p>
            </div>

            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
                asChild
              >
                <Link href={slide.cta.href}>
                  {slide.cta.text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-primary border-primary-foreground text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                asChild
              >
                <Link href="/auth/login">Identifiez-vous</Link>
              </Button>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              key={`stats-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/20"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">2M+</div>
                <div className="text-sm text-primary-foreground/80">Références</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">460</div>
                <div className="text-sm text-primary-foreground/80">Agences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4000</div>
                <div className="text-sm text-primary-foreground/80">Experts</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual elements */}
          <motion.div
            key={`visual-${currentSlide}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative lg:block hidden"
          >
            <div className="relative">
              {/* Floating cards */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute -top-4 -left-4 bg-primary-foreground/10 backdrop-blur-lg rounded-lg p-4 border border-primary-foreground/20 z-10"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-primary-foreground font-medium">35 000</div>
                    <div className="text-primary-foreground/80 text-sm">Références J+1</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute top-1/2 -right-4 bg-primary-foreground/10 backdrop-blur-lg rounded-lg p-4 border border-primary-foreground/20 z-10"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-primary-foreground font-medium">Livraison</div>
                    <div className="text-primary-foreground/80 text-sm">Express</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-foreground/10 backdrop-blur-lg rounded-lg p-4 border border-primary-foreground/20 z-10"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-primary-foreground font-medium">Expert</div>
                    <div className="text-primary-foreground/80 text-sm">Conseil</div>
                  </div>
                </div>
              </motion.div>

              {/* Main visual */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-80 h-80 bg-primary-foreground/5 backdrop-blur-lg rounded-2xl border border-primary-foreground/20 flex items-center justify-center"
              >
                <div className="w-32 h-32 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary-foreground rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-2xl">R</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Carousel controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => paginate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-primary-foreground"
                    : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => paginate(1)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
