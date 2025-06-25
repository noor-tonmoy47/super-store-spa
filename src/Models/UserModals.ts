export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserFormProps {
  user: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
}