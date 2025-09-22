"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, AlertTriangle } from "lucide-react";
import { useReportIssue, type CreateOrderIssueData } from "@/lib/hooks/useOrderIssues";

const reportIssueSchema = z.object({
  type: z.enum(['delivery_delay', 'product_damage', 'missing_items', 'wrong_items', 'billing_issue', 'other']),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères").max(200),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères").max(2000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

type ReportIssueFormData = z.infer<typeof reportIssueSchema>;

interface ReportIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  orderNumber: string;
}

const issueTypes = [
  { value: 'delivery_delay', label: 'Retard de livraison' },
  { value: 'product_damage', label: 'Produit endommagé' },
  { value: 'missing_items', label: 'Articles manquants' },
  { value: 'wrong_items', label: 'Mauvais articles' },
  { value: 'billing_issue', label: 'Problème de facturation' },
  { value: 'other', label: 'Autre' },
];

const priorities = [
  { value: 'low', label: 'Faible', color: 'text-green-600' },
  { value: 'medium', label: 'Moyenne', color: 'text-yellow-600' },
  { value: 'high', label: 'Élevée', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgente', color: 'text-red-600' },
];

export function ReportIssueModal({ 
  open, 
  onOpenChange, 
  orderId, 
  orderNumber 
}: ReportIssueModalProps) {
  const reportIssueMutation = useReportIssue();

  const form = useForm<ReportIssueFormData>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      type: 'other',
      subject: '',
      description: '',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: ReportIssueFormData) => {
    const issueData: CreateOrderIssueData = {
      orderId,
      type: data.type,
      subject: data.subject,
      description: data.description,
      priority: data.priority || 'medium',
    };

    reportIssueMutation.mutate(issueData, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    if (!reportIssueMutation.isPending) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Signaler un problème - Commande {orderNumber}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de problème *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issueTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <span className={priority.color}>{priority.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Résumé du problème en quelques mots"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre problème en détail. Plus vous donnerez d'informations, plus nous pourrons vous aider efficacement."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">
                    Information importante
                  </p>
                  <p className="text-blue-700">
                    Notre équipe support sera automatiquement notifiée de votre signalement. 
                    Vous recevrez une réponse dans les plus brefs délais à l'adresse email 
                    associée à votre compte.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={reportIssueMutation.isPending}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={reportIssueMutation.isPending}
                className="min-w-[120px]"
              >
                {reportIssueMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Signaler le problème'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
