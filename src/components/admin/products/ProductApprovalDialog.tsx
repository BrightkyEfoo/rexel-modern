'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X, Loader2 } from 'lucide-react'
import { approveProduct, rejectProduct } from '@/lib/api/products-validation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import type { Product } from '@/lib/api/types'
import { formatPrice } from '@/lib/utils/currency'
  
interface ProductApprovalDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'approve' | 'reject'
  onSuccess?: () => void
}

/**
 * Dialog pour approuver ou rejeter un produit
 * Admin only - Permet de valider ou refuser les produits soumis par les managers
 */
export function ProductApprovalDialog({
  product,
  open,
  onOpenChange,
  mode,
  onSuccess,
}: ProductApprovalDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')
  const [reason, setReason] = useState('')

  // Mutation pour approuver
  const approveMutation = useMutation({
    mutationFn: (data: { productId: number; comment?: string }) =>
      approveProduct(data.productId, { comment: data.comment }),
    onSuccess: (data) => {
      toast({
        title: 'Produit approuvé',
        description: data.message || 'Le produit a été approuvé avec succès',
      })
      queryClient.invalidateQueries({ queryKey: ['pending-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onOpenChange(false)
      setComment('')
      onSuccess?.()
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || "Impossible d'approuver le produit",
        variant: 'destructive',
      })
    },
  })

  // Mutation pour rejeter
  const rejectMutation = useMutation({
    mutationFn: (data: { productId: number; reason: string }) =>
      rejectProduct(data.productId, { reason: data.reason }),
    onSuccess: (data) => {
      toast({
        title: 'Produit rejeté',
        description: data.message || 'Le produit a été rejeté',
      })
      queryClient.invalidateQueries({ queryKey: ['pending-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onOpenChange(false)
      setReason('')
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de rejeter le produit',
        variant: 'destructive',
      })
    },
  })

  const handleApprove = () => {
    if (!product) return
    approveMutation.mutate({
      productId: product.id,
      comment: comment || undefined,
    })
  }

  const handleReject = () => {
    if (!product) return
    if (!reason.trim()) {
      toast({
        title: 'Raison requise',
        description: 'Vous devez fournir une raison pour rejeter ce produit',
        variant: 'destructive',
      })
      return
    }
    rejectMutation.mutate({
      productId: product.id,
      reason: reason,
    })
  }

  const isLoading = approveMutation.isPending || rejectMutation.isPending

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'approve' ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                Approuver le produit
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-600" />
                Rejeter le produit
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'approve'
              ? 'Approuver ce produit le rendra visible aux clients'
              : 'Rejeter ce produit et fournir une raison au manager'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informations du produit */}
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            {product.sku && (
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Soumis par: {(product as any).createdBy?.firstName}{' '}
              {(product as any).createdBy?.lastName}
            </p>
            {product.brand && (
              <p className="text-sm text-muted-foreground">Marque: {product.brand.name}</p>
            )}
            <p className="text-sm font-medium">Prix: {formatPrice(product.price)}</p>
          </div>

          {/* Champ de saisie selon le mode */}
          {mode === 'approve' ? (
            <div className="space-y-2">
              <Label htmlFor="comment">Commentaire (optionnel)</Label>
              <Textarea
                id="comment"
                placeholder="Ajouter un commentaire..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-red-600">
                Raison du rejet *
              </Label>
              <Textarea
                id="reason"
                placeholder="Expliquez pourquoi ce produit est rejeté..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="border-red-300 focus:border-red-500"
                required
              />
              <p className="text-xs text-muted-foreground">
                Cette raison sera visible par le manager qui a soumis le produit
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          {mode === 'approve' ? (
            <Button
              type="button"
              onClick={handleApprove}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Check className="mr-2 h-4 w-4" />
              Approuver
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleReject}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <X className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

