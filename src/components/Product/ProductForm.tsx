import { Loader2, Save } from "lucide-react";
import type { Product, ProductFormProps } from "../../Models/ProductModels";
import { useEffect, useState } from "react";
export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<Product>(product || { id: 0, name: '', price: 0 });

  useEffect(() => {
    setFormData(product || { id: 0, name: '', price: 0 });
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || '' : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (formData.name && (typeof formData.price === 'number' && !isNaN(formData.price))) {
      onSave({ ...formData, price: parseFloat(formData.price.toString()) });
    } else {
        // Optionally show an error toast/message
        console.error("Validation failed: Name and Price are required.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="productName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          id="productPrice"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} /> Saving...
            </>
          ) : (
            <>
              <Save size={20} className="mr-2" /> Save
            </>
          )}
        </button>
      </div>
    </form>
  );
};