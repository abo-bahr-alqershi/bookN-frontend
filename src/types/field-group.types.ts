import type { UnitTypeFieldDto } from './unit-type.types';
// أنواع بيانات مجموعات الحقول (Field Group Types)

/**
 * بيانات مجموعة حقول
 */
export interface FieldGroupDto {
  groupId: string;
  propertyTypeId: string;
  groupName: string;
  displayName: string;
  description: string;
  sortOrder: number;
  isCollapsible: boolean;
  isExpandedByDefault: boolean;
  fields: UnitTypeFieldDto[];
}

export interface CreateFieldGroupCommand {
  propertyTypeId: string;
  groupName: string;
  displayName?: string;
  description?: string;
  sortOrder: number;
  isCollapsible?: boolean;
  isExpandedByDefault?: boolean;
}

export interface UpdateFieldGroupCommand {
  groupId: string;
  groupName?: string;
  displayName?: string;
  description?: string;
  sortOrder?: number;
  isCollapsible?: boolean;
  isExpandedByDefault?: boolean;
}

export interface DeleteFieldGroupCommand {
  groupId: string;
}

export interface GroupOrderDto {
  groupId: string;
  sortOrder: number;
}

export interface ReorderFieldGroupsCommand {
  propertyTypeId: string;
  groupOrders: GroupOrderDto[];
}

export interface GetFieldGroupByIdQuery {
  groupId: string;
}

export interface GetFieldGroupsByPropertyTypeQuery {
  propertyTypeId: string;
}

export interface AssignFieldToGroupCommand {
  groupId: string;
  fieldId: string;
}

export interface GroupOrderDto {
  groupId: string;
  sortOrder: number;
} 