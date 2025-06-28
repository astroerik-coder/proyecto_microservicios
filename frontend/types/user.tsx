export interface User {
  id: number;
  nombreUsuario: string;
  correo: string;
  rol: "ADMIN" | "CLIENTE";
}
