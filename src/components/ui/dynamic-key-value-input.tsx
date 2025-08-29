"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

interface KeyValueItem {
  id: string;
  key: string;
  value: string;
}

interface DynamicKeyValueInputProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  useTextarea?: boolean;
  valueRows?: number;
  className?: string;
}

export function DynamicKeyValueInput({
  value,
  onChange,
  keyPlaceholder = "Clé",
  valuePlaceholder = "Valeur",
  useTextarea = false,
  valueRows = 2,
  className = "",
}: DynamicKeyValueInputProps) {
  const [items, setItems] = useState<KeyValueItem[]>(() => {
    return Object.entries(value).map(([key, val], index) => ({
      id: `item-${index}`,
      key,
      value: val,
    }));
  });

  const isUpdatingRef = useRef(false);

  // Synchroniser les items avec la valeur externe seulement si ce n'est pas une mise à jour interne
  useEffect(() => {
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      return;
    }

    const currentEntries = Object.entries(value);
    const currentItems = items.map(item => [item.key, item.value]);
    
    // Vérifier si les données sont synchronisées
    const isSynced = currentEntries.length === currentItems.length &&
      currentEntries.every(([key, val], index) => 
        currentItems[index] && currentItems[index][0] === key && currentItems[index][1] === val
      );
    
    if (!isSynced) {
      setItems(Object.entries(value).map(([key, val], index) => ({
        id: `item-${index}`,
        key,
        value: val,
      })));
    }
  }, [value]);

  const updateExternalValue = useCallback((newItems: KeyValueItem[]) => {
    isUpdatingRef.current = true;
    const newValue: Record<string, string> = {};
    newItems.forEach(item => {
      if (item.key.trim()) {
        newValue[item.key.trim()] = item.value;
      }
    });
    onChange(newValue);
  }, [onChange]);

  const addItem = useCallback(() => {
    const newItem: KeyValueItem = {
      id: `item-${Date.now()}`,
      key: "",
      value: "",
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    // Ne pas appeler updateExternalValue pour les éléments vides
  }, [items]);

  const removeItem = useCallback((id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    updateExternalValue(newItems);
  }, [items, updateExternalValue]);

  const updateItem = useCallback((id: string, field: 'key' | 'value', newValue: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, [field]: newValue } : item
    );
    setItems(newItems);
    updateExternalValue(newItems);
  }, [items, updateExternalValue]);

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="flex gap-2">
          <Input
            placeholder={keyPlaceholder}
            value={item.key}
            onChange={(e) => updateItem(item.id, 'key', e.target.value)}
            className="flex-1"
          />
          {useTextarea ? (
            <Textarea
              placeholder={valuePlaceholder}
              value={item.value}
              onChange={(e) => updateItem(item.id, 'value', e.target.value)}
              className="flex-1"
              rows={valueRows}
            />
          ) : (
            <Input
              placeholder={valuePlaceholder}
              value={item.value}
              onChange={(e) => updateItem(item.id, 'value', e.target.value)}
              className="flex-1"
            />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeItem(item.id)}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un élément
      </Button>
    </div>
  );
}
