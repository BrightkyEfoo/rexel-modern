"use client";

import { Suspense } from "react";
import { SearchPageContent } from "./SearchPageContent";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SearchPage() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<SearchPageSkeleton />}>
            <SearchPageContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
}

function SearchPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
        <div className="h-12 bg-muted rounded animate-pulse" />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-muted rounded w-32 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-5 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
