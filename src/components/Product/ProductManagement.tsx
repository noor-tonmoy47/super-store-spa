import { useEffect, useState } from "react";
import type { Product } from "../../Models/ProductModels";
import type { ToastState } from "../../Models/ToastProps";
import { Package, Plus } from "lucide-react";
import { ProductList } from "./ProductList";
import { Modal } from "../Modal";
import { ProductForm } from "./ProductForm";
import { Toast } from "../Toast";
import { axiosInstance } from "../../Setup/Axios";

export const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const productAPI =
    {
        // Product API calls
        getProducts: async (): Promise<Product[]> => {
            const response = await axiosInstance.get<Product[]>('/products');
            return response.data;
        },
        addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
            const response = await axiosInstance.post<Product>('/products', product);
            return response.data;
        },
        updateProduct: async (product: Product): Promise<Product> => {
            const response = await axiosInstance.put<Product>(`/products/${product.id}`, product);
            return response.data;
        },
        deleteProduct: async (id: number): Promise<void> => {
            await axiosInstance.delete(`/products/${id}`);
        },
    }
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await productAPI.getProducts();
            setProducts(data);
        } catch (error: any) {
            console.error("Error fetching products:", error);
            setToast({ message: "Failed to load products.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDeleteProduct = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setIsSaving(true);
            try {
                await productAPI.deleteProduct(id);
                setToast({ message: "Product deleted successfully!", type: "success" });
                fetchProducts();
            } catch (error: any) {
                console.error("Error deleting product:", error);
                setToast({ message: `Failed to delete product: ${error.message}`, type: "error" });
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleSaveProduct = async (product: Product) => {
        setIsSaving(true);
        try {
            if (product.id === 0) {
                await productAPI.addProduct(product);
                setToast({ message: "Product added successfully!", type: "success" });
            } else {
                await productAPI.updateProduct(product);
                setToast({ message: "Product updated successfully!", type: "success" });
            }
            setIsFormOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error: any) {
            console.error("Error saving product:", error);
            setToast({ message: `Failed to save product: ${error.message}`, type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <Package size={30} className="mr-3 text-blue-600" /> Product Management
            </h1>
            <div className="mb-6 flex justify-end">
                <button
                    onClick={handleAddProduct}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-colors flex items-center transform hover:scale-105"
                >
                    <Plus size={20} className="mr-2" /> Add New Product
                </button>
            </div>

            <ProductList
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                isLoading={isLoading || isSaving}
            />

            <Modal isOpen={isFormOpen} onClose={handleCancelForm} title={editingProduct ? "Edit Product" : "Add New Product"}>
                <ProductForm
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleCancelForm}
                    isLoading={isSaving}
                />
            </Modal>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};