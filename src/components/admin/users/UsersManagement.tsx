'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, toggleSuspendUser, bulkSuspendUsers, bulkDeleteUsers, type User, type UsersFilters } from '@/lib/api/users'
import { UserType } from '@/lib/types/user'
import { UserFormDialog } from './UserFormDialog'
import { UserDeleteDialog } from './UserDeleteDialog'
import { BulkDeleteDialog } from './BulkDeleteDialog'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Users, Plus, Search, MoreVertical, Edit, Trash2, Loader2, CheckCircle, XCircle, Ban, UserCheck } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Checkbox } from '@/components/ui/checkbox'

export function UsersManagement() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [filters, setFilters] = useState<UsersFilters>({
    page: 1,
    per_page: 20,
    sort_by: 'created_at',
    sort_order: 'desc',
  })
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Query pour récupérer les utilisateurs
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => getUsers(filters),
  })

  const users = data?.data || []
  const meta = data?.meta

  // Mutation pour suspendre/réactiver un utilisateur
  const suspendMutation = useMutation({
    mutationFn: ({ userId, suspend }: { userId: number, suspend: boolean }) => 
      toggleSuspendUser(userId, suspend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Succès',
        description: 'Le statut de l\'utilisateur a été mis à jour.',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour.',
        variant: 'destructive',
      })
    },
  })

  // Mutation pour suspendre/réactiver plusieurs utilisateurs en masse
  const bulkSuspendMutation = useMutation({
    mutationFn: async ({ suspend }: { suspend: boolean }) => {
      const userIds = selectedUsers.map(user => user.id)
      return bulkSuspendUsers(userIds, suspend)
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setSelectedUsers([])
      
      const count = response.data?.updated?.length || selectedUsers.length
      toast({
        title: 'Succès',
        description: variables.suspend 
          ? `${count} utilisateur(s) suspendu(s)`
          : `${count} utilisateur(s) réactivé(s)`,
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour en masse.',
        variant: 'destructive',
      })
    },
  })

  // Mutation pour supprimer plusieurs utilisateurs en masse
  const bulkDeleteMutation = useMutation({
    mutationFn: async () => {
      const userIds = selectedUsers.map(user => user.id)
      return bulkDeleteUsers(userIds)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      const count = response.data?.deleted?.length || selectedUsers.length
      setSelectedUsers([])
      
      toast({
        title: 'Succès',
        description: `${count} utilisateur(s) supprimé(s)`,
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression en masse.',
        variant: 'destructive',
      })
    },
  })

  const handleSearch = () => {
    setFilters({ ...filters, search, page: 1 })
  }

  const handleFilterType = (type: string) => {
    setFilters({
      ...filters,
      type: type === 'all' ? undefined : (type as UserType),
      page: 1,
    })
  }

  const handleFilterVerified = (verified: string) => {
    setFilters({
      ...filters,
      isVerified: verified === 'all' ? undefined : verified === 'true',
      page: 1,
    })
  }

  const handleCreate = () => {
    setSelectedUser(null)
    setFormDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleToggleSuspend = (user: User) => {
    suspendMutation.mutate({
      userId: user.id,
      suspend: !user.isSuspended
    })
  }

  const handleBulkSuspend = (suspend: boolean) => {
    bulkSuspendMutation.mutate({ suspend })
  }

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate()
    setBulkDeleteDialogOpen(false)
  }

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage })
  }

  // Gestion de la sélection
  const isAllSelected = users.length > 0 && selectedUsers.length === users.length
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Sélectionner seulement les utilisateurs non-admin
      setSelectedUsers(users.filter(u => u.type !== UserType.ADMIN))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (user: User, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, user])
    } else {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
    }
  }

  const getUserTypeBadge = (type: UserType) => {
    switch (type) {
      case UserType.ADMIN:
        return <Badge variant="destructive">Admin</Badge>
      case UserType.MANAGER:
        return <Badge variant="default" className="bg-purple-600">Manager</Badge>
      case UserType.CUSTOMER:
        return <Badge variant="secondary">Client</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription>
                {meta?.total || 0} utilisateur{(meta?.total || 0) > 1 ? 's' : ''} au total
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un utilisateur
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <Select
              value={filters.type || 'all'}
              onValueChange={handleFilterType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value={UserType.ADMIN}>Administrateurs</SelectItem>
                <SelectItem value={UserType.MANAGER}>Managers</SelectItem>
                <SelectItem value={UserType.CUSTOMER}>Clients</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.isVerified === undefined ? 'all' : filters.isVerified.toString()}
              onValueChange={handleFilterVerified}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="true">Vérifiés</SelectItem>
                <SelectItem value="false">Non vérifiés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Erreur lors du chargement des utilisateurs</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Aucun utilisateur trouvé</p>
              <p className="text-sm text-muted-foreground">
                Essayez de modifier vos filtres ou créez un nouvel utilisateur
              </p>
            </div>
          ) : (
            <>
              {/* Actions en lot */}
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4 flex-wrap">
                  <span className="text-sm font-medium">
                    {selectedUsers.length} utilisateur(s) sélectionné(s)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkSuspend(true)}
                    disabled={bulkSuspendMutation.isPending || bulkDeleteMutation.isPending}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Suspendre la sélection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkSuspend(false)}
                    disabled={bulkSuspendMutation.isPending || bulkDeleteMutation.isPending}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Réactiver la sélection
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={bulkSuspendMutation.isPending || bulkDeleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer la sélection
                  </Button>
                </div>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={isAllSelected}
                          ref={(el) => {
                            if (el) {
                              (el as any).indeterminate = isIndeterminate
                            }
                          }}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Créé le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.type !== UserType.ADMIN && (
                            <Checkbox
                              checked={selectedUsers.some(u => u.id === user.id)}
                              onCheckedChange={(checked) => handleSelectUser(user, checked as boolean)}
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getUserTypeBadge(user.type)}</TableCell>
                        <TableCell>{user.company || '-'}</TableCell>
                        <TableCell>{user.phone || '-'}</TableCell>
                        <TableCell>
                          {user.isSuspended ? (
                            <div className="flex items-center gap-1 text-red-600">
                              <Ban className="w-4 h-4" />
                              <span className="text-sm">Suspendu</span>
                            </div>
                          ) : user.isVerified ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">Vérifié</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <XCircle className="w-4 h-4" />
                              <span className="text-sm">Non vérifié</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              {user.type !== UserType.ADMIN && (
                                <DropdownMenuItem 
                                  onClick={() => handleToggleSuspend(user)}
                                  className={user.isSuspended ? "text-green-600" : "text-orange-600"}
                                >
                                  {user.isSuspended ? (
                                    <>
                                      <UserCheck className="w-4 h-4 mr-2" />
                                      Réactiver
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="w-4 h-4 mr-2" />
                                      Suspendre
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(user)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {meta.current_page} sur {meta.last_page}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(meta.current_page - 1)}
                      disabled={meta.current_page === 1}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(meta.current_page + 1)}
                      disabled={meta.current_page === meta.last_page}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UserFormDialog
        user={selectedUser}
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
      />
      <UserDeleteDialog
        user={selectedUser}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
      <BulkDeleteDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={confirmBulkDelete}
        count={selectedUsers.length}
        isLoading={bulkDeleteMutation.isPending}
      />
    </>
  )
}


