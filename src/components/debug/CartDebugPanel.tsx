'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartSync } from '@/lib/hooks/useCartSync';
import { useCart } from '@/lib/query/hooks';
import { useAuth } from '@/lib/auth/nextauth-hooks';
import { useSessionId } from '@/lib/hooks/useSessionId';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';

export function CartDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated, session } = useAuth();
  const { sessionId } = useSessionId();
  const { items: localItems, totalItems: localTotal, totalPrice: localPrice } = useCartSync();
  const { data: backendCart, refetch: refetchBackendCart } = useCart();
  
  const hasValidToken = !!session?.accessToken;

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          Debug Panier
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-y-auto">
      <Card className="bg-background/95 backdrop-blur-sm border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Panier (NextAuth)</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchBackendCart()}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVisible(false)}
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* État d'authentification NextAuth */}
          <div className="space-y-1">
            <div className="font-semibold">NextAuth:</div>
            <div className="flex gap-2">
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? "Connecté" : "Non connecté"}
              </Badge>
              <Badge variant={hasValidToken ? "default" : "destructive"}>
                {hasValidToken ? "Token OK" : "Pas de token"}
              </Badge>
            </div>
            {session?.user && (
              <div className="text-xs text-muted-foreground">
                {session.user.email} ({session.user.type})
              </div>
            )}
          </div>

          {/* Session ID */}
          <div className="space-y-1">
            <div className="font-semibold">Session ID:</div>
            <div className="font-mono text-xs bg-muted p-1 rounded">
              {sessionId || "Non défini"}
            </div>
          </div>

          {/* Panier local */}
          <div className="space-y-1">
            <div className="font-semibold">Panier Local:</div>
            <div className="space-y-1">
              <div>Items: {localItems.length}</div>
              <div>Total: {localTotal}</div>
              <div>Prix: {localPrice.toFixed(2)} €</div>
            </div>
            {localItems.length > 0 && (
              <div className="max-h-20 overflow-y-auto bg-muted p-1 rounded text-xs">
                {localItems.map((item, index) => (
                  <div key={index}>
                    {item.product.name} (x{item.quantity})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panier backend */}
          <div className="space-y-1">
            <div className="font-semibold">Panier Backend:</div>
            {backendCart ? (
              <div className="space-y-1">
                <div>Items: {backendCart.data?.items?.length || 0}</div>
                <div>Total: {backendCart.data?.totalItems || 0}</div>
                <div>Prix: {(backendCart.data?.totalPrice || 0).toFixed(2)} €</div>
                {backendCart.data?.items && backendCart.data.items.length > 0 && (
                  <div className="max-h-20 overflow-y-auto bg-muted p-1 rounded text-xs">
                    {backendCart.data.items.map((item, index) => (
                      <div key={index}>
                        {item.product.name} (x{item.quantity})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">Non chargé</div>
            )}
          </div>

          {/* Synchronisation */}
          <div className="space-y-1">
            <div className="font-semibold">Synchronisation:</div>
            <div className="flex gap-2">
              <Badge variant={localItems.length === (backendCart?.data?.items?.length || 0) ? "default" : "destructive"}>
                {localItems.length === (backendCart?.data?.items?.length || 0) ? "Synchronisé" : "Désynchronisé"}
              </Badge>
            </div>
          </div>

          {/* Informations de debug */}
          <div className="space-y-1">
            <div className="font-semibold">Debug Info:</div>
            <div className="text-xs space-y-1">
              <div>NextAuth Status: {isAuthenticated ? "authenticated" : "unauthenticated"}</div>
              <div>Token Present: {hasValidToken ? "Yes" : "No"}</div>
              <div>Session ID: {sessionId ? "Present" : "Missing"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
