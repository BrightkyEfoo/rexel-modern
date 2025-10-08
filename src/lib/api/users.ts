import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse } from './types'
import { UserType } from '../types/user'
import nextAuthApiClient from './nextauth-client'

/**
 * Service API pour la gestion des utilisateurs (Admin only)
 */

export interface User {
  id: number
  firstName: string | null
  lastName: string | null
  email: string
  company: string | null
  phone: string | null
  type: UserType
  isVerified: boolean
  isSuspended?: boolean
  createdAt: string
  updatedAt: string | null
}

export interface UsersResponse extends PaginatedResponse<User> {
  message: string
  status: number
  timestamp: string
}

export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  type: UserType
  company?: string
  phone?: string
  isVerified?: boolean
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  type?: UserType
  company?: string
  phone?: string
  isVerified?: boolean
}

export interface UsersFilters {
  search?: string
  type?: UserType
  isVerified?: boolean
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Récupère la liste des utilisateurs avec pagination et filtres
 */
export async function getUsers(filters?: UsersFilters): Promise<UsersResponse> {
  const response = await nextAuthApiClient.get<UsersResponse>('/secured/users', {
    // @ts-ignore
    params: filters,
  })

  console.log("users",response)

  return response.data
}

/**
 * Récupère un utilisateur par ID
 */
export async function getUserById(id: number): Promise<ApiResponse<User>> {
  const response = await apiClient.get<ApiResponse<User>>(`/secured/users/${id}`)
  return response.data
}

/**
 * Crée un nouvel utilisateur
 */
export async function createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
  const response = await apiClient.post<ApiResponse<User>>('/secured/users', data)
  return response.data
}

/**
 * Met à jour un utilisateur
 */
export async function updateUser(id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> {
  const response = await apiClient.put<ApiResponse<User>>(`/secured/users/${id}`, data)
  return response.data
}

/**
 * Supprime un utilisateur
 */
export async function deleteUser(id: number): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`/secured/users/${id}`)
  return response.data
}

/**
 * Vérifie si un email est unique
 */
export async function checkEmailUnique(
  email: string,
  userId?: number
): Promise<{ unique: boolean; message: string }> {
  const response = await apiClient.post<{ unique: boolean; message: string }>(
    '/secured/users/validate/email',
    { email, userId }
  )
  return response.data
}

/**
 * Suspend ou réactive un utilisateur
 */
export async function toggleSuspendUser(id: number, suspend: boolean): Promise<ApiResponse<User>> {
  const response = await nextAuthApiClient.put<ApiResponse<User>>(`/secured/users/${id}/suspend`, {
    isSuspended: suspend
  })
  return response.data
}

/**
 * Suspend ou réactive plusieurs utilisateurs en masse
 */
export async function bulkSuspendUsers(userIds: number[], suspend: boolean): Promise<ApiResponse<{
  updated: User[]
  errors: Array<{ userId: number; error: string }>
}>> {
  const response = await nextAuthApiClient.put<ApiResponse<{
    updated: User[]
    errors: Array<{ userId: number; error: string }>
  }>>('/secured/users/bulk-suspend', {
    userIds,
    isSuspended: suspend
  })
  return response.data
}

/**
 * Supprime plusieurs utilisateurs en masse
 */
export async function bulkDeleteUsers(userIds: number[]): Promise<ApiResponse<{
  deleted: number[]
  errors: Array<{ userId: number; error: string }>
}>> {
  const response = await nextAuthApiClient.delete<ApiResponse<{
    deleted: number[]
    errors: Array<{ userId: number; error: string }>
  }>>('/secured/users/bulk-delete', {
    data: { userIds }
  })
  return response.data
}


