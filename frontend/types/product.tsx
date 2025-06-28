export interface Product {
  id?: number;         
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  eliminado?: boolean; 
  creado_en?: string;
  actualizado_en?: string;
}