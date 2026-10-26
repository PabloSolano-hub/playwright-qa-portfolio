/** Response shapes of the Toolshop API, limited to the fields the suite relies on. */

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Address {
  street?: string | null;
  house_number?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address?: Address;
}

export interface NewUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  dob: string;
  phone: string;
  address: Address;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  in_stock: boolean;
  is_rental: boolean;
  category: Category;
}

export interface Paginated<T> {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: T[];
}

export interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  product: Product;
}

export interface Cart {
  id: string;
  cart_items: CartItem[];
}

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}
