"use client";

import { useQueryState } from "nuqs";
import { useCallback } from "react";

export type AdminTabType = 'overview' | 'products' | 'categories' | 'brands' | 'pickup-points' | 'orders';

export function useAdminTabs() {
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'overview' as AdminTabType,
    parse: (value: string): AdminTabType => {
      const validTabs: AdminTabType[] = ['overview', 'products', 'categories', 'brands', 'pickup-points', 'orders'];
      return validTabs.includes(value as AdminTabType) ? (value as AdminTabType) : 'overview';
    },
    serialize: (value: AdminTabType) => value,
    history: 'push',
    shallow: true,
    clearOnDefault: true,
  });

  const changeTab = useCallback((newTab: AdminTabType) => {
    setActiveTab(newTab);
  }, [setActiveTab]);

  return {
    activeTab,
    changeTab,
  };
}
