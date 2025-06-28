// utils/inventario.ts
export function mergeProductoEnLista<T extends { id: number }>(
  lista: T[],
  producto: T
): T[] {
  const existe = lista.some((p) => p.id === producto.id);
  return existe
    ? lista.map((p) => (p.id === producto.id ? producto : p))
    : [...lista, producto];
}

export function eliminarProductoDeLista<T extends { id: number }>(
  lista: T[],
  productoId: number
): T[] {
  return lista.filter((p) => p.id !== productoId);
}
