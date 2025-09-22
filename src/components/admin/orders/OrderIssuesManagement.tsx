"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Filter,
} from "lucide-react";
import {
  useAdminOrderIssues,
  useUpdateOrderIssue,
  type AdminOrderIssue,
  type UpdateOrderIssueData,
} from "@/lib/hooks/useAdminOrderIssues";
import { formatPrice } from "@/lib/utils/currency";

const updateIssueSchema = z.object({
  status: z
    .enum(["pending", "acknowledged", "investigating", "resolved", "closed"])
    .optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  adminNotes: z.string().max(2000).optional(),
  resolution: z.string().max(1000).optional(),
});

type UpdateIssueFormData = z.infer<typeof updateIssueSchema>;

export function OrderIssuesManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<AdminOrderIssue | null>(
    null
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const {
    data: issuesData,
    isLoading,
    refetch,
  } = useAdminOrderIssues({
    page: currentPage,
    limit: 20,
    search,
    status: statusFilter,
    priority: priorityFilter,
  });

  const updateIssueMutation = useUpdateOrderIssue();

  const form = useForm<UpdateIssueFormData>({
    resolver: zodResolver(updateIssueSchema),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const openUpdateModal = (issue: AdminOrderIssue) => {
    setSelectedIssue(issue);
    form.reset({
      status: issue.status as any,
      priority: issue.priority as any,
      adminNotes: issue.adminNotes || "",
      resolution: issue.resolution || "",
    });
    setShowUpdateModal(true);
  };

  const onSubmit = async (data: UpdateIssueFormData) => {
    if (!selectedIssue) return;

    const updateData: UpdateOrderIssueData = {};
    if (data.status !== selectedIssue.status) updateData.status = data.status;
    if (data.priority !== selectedIssue.priority)
      updateData.priority = data.priority;
    if (data.adminNotes !== selectedIssue.adminNotes)
      updateData.adminNotes = data.adminNotes;
    if (data.resolution !== selectedIssue.resolution)
      updateData.resolution = data.resolution;

    updateIssueMutation.mutate(
      { issueId: selectedIssue.id, data: updateData },
      {
        onSuccess: () => {
          setShowUpdateModal(false);
          setSelectedIssue(null);
          refetch();
        },
      }
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "acknowledged":
        return <Eye className="w-4 h-4 text-blue-500" />;
      case "investigating":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "acknowledged":
        return "default";
      case "investigating":
        return "secondary";
      case "resolved":
        return "default";
      case "closed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // @ts-ignore
  const issues = issuesData?.data.data || [];

  console.log({ issuesData, issues });
  const totalPages = issuesData?.meta.lastPage || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des signalements</h2>
          <p className="text-muted-foreground">
            Gérez les problèmes signalés par les clients
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="acknowledged">
                    Accusé de réception
                  </SelectItem>
                  <SelectItem value="investigating">
                    En investigation
                  </SelectItem>
                  <SelectItem value="resolved">Résolu</SelectItem>
                  <SelectItem value="closed">Fermé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tableau des signalements */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : issues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun signalement trouvé.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Commande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues?.map((issue: any) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-mono text-sm">
                      {issue.issueNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {issue.order.orderNumber}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatPrice(issue.order.totalAmount)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {issue.user.firstName} {issue.user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {issue.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {issue.type === "delivery_delay" &&
                          "Retard de livraison"}
                        {issue.type === "product_damage" && "Produit endommagé"}
                        {issue.type === "missing_items" && "Articles manquants"}
                        {issue.type === "wrong_items" && "Mauvais articles"}
                        {issue.type === "billing_issue" &&
                          "Problème de facturation"}
                        {issue.type === "other" && "Autre"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority === "urgent" && "Urgente"}
                        {issue.priority === "high" && "Élevée"}
                        {issue.priority === "medium" && "Moyenne"}
                        {issue.priority === "low" && "Faible"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(issue.status)}
                        <Badge variant={getStatusVariant(issue.status)}>
                          {issue.status === "pending" && "En attente"}
                          {issue.status === "acknowledged" && "Accusé"}
                          {issue.status === "investigating" && "Investigation"}
                          {issue.status === "resolved" && "Résolu"}
                          {issue.status === "closed" && "Fermé"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(issue.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openUpdateModal(issue)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Gérer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <Button
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
            />
          </PaginationContent>
        </Pagination>
      )}

      {/* Modal de mise à jour */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Gérer le signalement {selectedIssue?.issueNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedIssue && (
            <div className="space-y-6">
              {/* Informations du signalement */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">{selectedIssue.subject}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {selectedIssue.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Commande:</span>{" "}
                    {selectedIssue.order.orderNumber}
                  </div>
                  <div>
                    <span className="font-medium">Client:</span>{" "}
                    {selectedIssue.user.firstName} {selectedIssue.user.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {selectedIssue.type}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(selectedIssue.createdAt).toLocaleDateString(
                      "fr-FR"
                    )}
                  </div>
                </div>
              </div>

              {/* Formulaire de mise à jour */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statut</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>
                                  Sélectionnez le statut
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">
                                Tous les statuts
                              </SelectItem>
                              <SelectItem value="pending">
                                En attente
                              </SelectItem>
                              <SelectItem value="acknowledged">
                                Accusé de réception
                              </SelectItem>
                              <SelectItem value="investigating">
                                En investigation
                              </SelectItem>
                              <SelectItem value="resolved">Résolu</SelectItem>
                              <SelectItem value="closed">Fermé</SelectItem>
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>
                                  Sélectionnez la priorité
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">
                                Toutes les priorités
                              </SelectItem>
                              <SelectItem value="low">Faible</SelectItem>
                              <SelectItem value="medium">Moyenne</SelectItem>
                              <SelectItem value="high">Élevée</SelectItem>
                              <SelectItem value="urgent">Urgente</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="adminNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes administratives</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notes internes pour le suivi..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resolution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Résolution</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description de la résolution du problème..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowUpdateModal(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateIssueMutation.isPending}
                    >
                      {updateIssueMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Mise à jour...
                        </>
                      ) : (
                        "Mettre à jour"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
