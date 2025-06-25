import { Edit, Loader2, Trash2 } from "lucide-react";
import type { UserListProps } from "../../Models/UserModals";

export const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        <Loader2 className="animate-spin mr-2" size={24} /> Loading Users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No users found. Add a new one!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(user)}
                  className="inline-flex items-center p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors mr-2"
                  aria-label={`Edit ${user.name}`}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="inline-flex items-center p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                  aria-label={`Delete ${user.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};