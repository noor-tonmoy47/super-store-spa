import "./App.css";
import { useState, type JSX } from "react";
import { ProductManagement } from "./components/Product/ProductManagement";
import { UserManagement } from "./components/User/UserManagement";
import { Package, Users } from "lucide-react";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'products' | 'users'>('products');

  const renderPage = (): JSX.Element => {
    switch (currentPage) {
      case 'products':
        return <ProductManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        `}
      </style> */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center rounded-b-xl">
        <h1 className="text-2xl font-bold text-gray-900">SuperStore Admin</h1>
        <nav className="space-x-4">
          <button
            onClick={() => setCurrentPage('products')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${currentPage === 'products' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Package size={20} className="mr-2" /> Products
          </button>
          <button
            onClick={() => setCurrentPage('users')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${currentPage === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Users size={20} className="mr-2" /> Users
          </button>
        </nav>
      </header>

      <main className="container mx-auto mt-8 max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;