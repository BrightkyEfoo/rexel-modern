import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { CategoryDetail, SearchFilters } from '@/lib/api/types';

type AvailabilityOption = 'in_stock' | 'out_of_stock' | 'limited';

const AVAILABILITY_OPTIONS: { value: AvailabilityOption; label: string }[] = [
  { value: 'in_stock', label: 'En stock' },
  { value: 'limited', label: 'Stock limité' },
  { value: 'out_of_stock', label: 'Rupture de stock' }
];

interface FilterContentProps {
  categoryData: CategoryDetail;
  filters: SearchFilters;
  priceRange: [number, number];
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export function FilterContent({
  categoryData,
  filters,
  priceRange,
  onFilterChange,
  onPriceChange,
  onClearFilters
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtres</h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-2" />
          Effacer
        </Button>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Prix (€)</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={onPriceChange}
            max={categoryData.filters?.priceRange?.max || 1000}
            step={10}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{priceRange[0]}€</span>
          <span>-</span>
          <span>{priceRange[1]}€</span>
        </div>
      </div>

      {/* Brands */}
      {categoryData.filters?.brands && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Marques</Label>
          <div className="space-y-2">
            {categoryData.filters.brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={filters.brands?.includes(brand.id) || false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onFilterChange({
                        brands: [...(filters.brands || []), brand.id]
                      });
                    } else {
                      onFilterChange({
                        brands: filters.brands?.filter(b => b !== brand.id)
                      });
                    }
                  }}
                />
                <label
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm text-gray-700 flex-1 cursor-pointer"
                >
                  {brand.name} ({brand.productCount})
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Disponibilité</Label>
        <div className="space-y-2">
          {AVAILABILITY_OPTIONS.map((availability) => (
            <div key={availability.value} className="flex items-center space-x-2">
              <Checkbox
                id={`availability-${availability.value}`}
                checked={filters.availability?.includes(availability.value) || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onFilterChange({
                      availability: [...(filters.availability || []), availability.value]
                    });
                  } else {
                    onFilterChange({
                      availability: filters.availability?.filter(a => a !== availability.value)
                    });
                  }
                }}
              />
              <label
                htmlFor={`availability-${availability.value}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {availability.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 