'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'

interface BulkDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  count: number
  isLoading?: boolean
}

export function BulkDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  count,
  isLoading = false,
}: BulkDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            Confirmer la suppression
          </AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer{' '}
            <span className="font-semibold text-foreground">{count}</span>{' '}
            utilisateur{count > 1 ? 's' : ''} ?
            <br />
            <br />
            Cette action est <span className="font-semibold text-destructive">irréversible</span>.
            Les utilisateurs supprimés ne pourront pas être récupérés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

