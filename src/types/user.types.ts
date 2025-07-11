// أنواع بيانات المستخدمين (Users)

export interface UserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  createdAt: string; // ISO date
  isActive: boolean;
}

export interface CreateUserCommand {
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
}

export interface UpdateUserCommand {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface ActivateUserCommand {
  userId: string;
}

export interface DeactivateUserCommand {
  userId: string;
}

export interface GetAllUsersQuery {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  isAscending?: boolean;
  roleId?: string;
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  lastLoginAfter?: string;
  loyaltyTier?: string;
  minTotalSpent?: number;
}

export interface SearchUsersQuery {
  searchTerm: string;
  filterCriteria?: string;
  pageNumber?: number;
  pageSize?: number;
  roleId?: string;
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  lastLoginAfter?: string;
  loyaltyTier?: string;
  minTotalSpent?: number;
  sortBy?: string;
}
