export interface CategoryResponse {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isActive: boolean;
  affiliateLink?: string;
  createdAt: string;
  userId?: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  color?: string;
  icon?: string;
  affiliateLink?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  affiliateLink?: string;
}