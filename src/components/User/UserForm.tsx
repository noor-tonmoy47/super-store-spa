import { useEffect, useState } from "react";
import type { User, UserFormProps } from "../../Models/UserModals";
import { Loader2, Save } from "lucide-react";

export const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<User>(user || { id: 0, name: '', email: '' });

  useEffect(() => {
    setFormData(user || { id: 0, name: '', email: '' });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSave(formData);
    } else {
        // Optionally show an error toast/message
        console.error("Validation failed: Name and Email are required.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="userName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="userEmail"
          name="email"
          value={formData.email}
          onChange={handleChange}
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