import { useEffect, useState } from "react";
import type { User } from "../../Models/UserModals";
import type { ToastState } from "../../Models/ToastProps";
import { Plus, Users } from "lucide-react";
import { UserList } from "./UserList";
import { Modal } from "../Modal";
import { UserForm } from "./UserForm";
import { Toast } from "../Toast";
import { axiosInstance } from "../../Setup/Axios";

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const userAPI = {
        getUsers: async (): Promise<User[]> => {
            const response = await axiosInstance.get<User[]>('/users');
            return response.data;
        },
        addUser: async (user: Omit<User, 'id'>): Promise<User> => {
            const response = await axiosInstance.post<User>('/users', user);
            return response.data;
        },
        updateUser: async (user: User): Promise<User> => {
            const response = await axiosInstance.put<User>(`/users/${user.id}`, user);
            return response.data;
        },
        deleteUser: async (id: number): Promise<void> => {
            await axiosInstance.delete(`/users/${id}`);
        },
    }
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await userAPI.getUsers();
            setUsers(data);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            setToast({ message: "Failed to load users.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleDeleteUser = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setIsSaving(true);
            try {
                await userAPI.deleteUser(id);
                setToast({ message: "User deleted successfully!", type: "success" });
                fetchUsers();
            } catch (error: any) {
                console.error("Error deleting user:", error);
                setToast({ message: `Failed to delete user: ${error.message}`, type: "error" });
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleSaveUser = async (user: User) => {
        setIsSaving(true);
        try {
            if (user.id === 0) { // Assuming 0 for new user
                await userAPI.addUser(user);
                setToast({ message: "User added successfully!", type: "success" });
            } else {
                await userAPI.updateUser(user);
                setToast({ message: "User updated successfully!", type: "success" });
            }
            setIsFormOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error: any) {
            console.error("Error saving user:", error);
            setToast({ message: `Failed to save user: ${error.message}`, type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelForm = () => {
        setIsFormOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <Users size={30} className="mr-3 text-purple-600" /> User Management
            </h1>
            <div className="mb-6 flex justify-end">
                <button
                    onClick={handleAddUser}
                    className="px-6 py-3 bg-purple-600 text-white rounded-md shadow-lg hover:bg-purple-700 transition-colors flex items-center transform hover:scale-105"
                >
                    <Plus size={20} className="mr-2" /> Add New User
                </button>
            </div>

            <UserList
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                isLoading={isLoading || isSaving}
            />

            <Modal isOpen={isFormOpen} onClose={handleCancelForm} title={editingUser ? "Edit User" : "Add New User"}>
                <UserForm
                    user={editingUser}
                    onSave={handleSaveUser}
                    onCancel={handleCancelForm}
                    isLoading={isSaving}
                />
            </Modal>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};