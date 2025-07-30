export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  status: "active" | "inactive";
}

export interface SalesDataItem {
  date: string;
  sales: number;
}

export interface Stats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: "user" | "admin";
  createdAt: string;
}