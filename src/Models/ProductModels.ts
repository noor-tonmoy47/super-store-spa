export interface Product {
  id: number;
  name: string;
  price: number;
}
export interface ProductFormProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
}