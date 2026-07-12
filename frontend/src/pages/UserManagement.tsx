import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Plus, X, Shield } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

interface UserAccount {
  name: string;
  email: string;
  role: string;
  status: string;
  created_on: string;
}

const initialUsers: UserAccount[] = [
  { name: "Super Admin", email: "admin@transitops.com", role: "Admin", status: "Active", created_on: "01 Jun 2026" },
  { name: "Rohan T.", email: "fleet@transitops.com", role: "Fleet Manager", status: "Active", created_on: "03 Jun 2026" },
  { name: "Raven K.", email: "dispatch@transitops.com", role: "Dispatcher", status: "Active", created_on: "03 Jun 2026" },
  { name: "Priya S.", email: "safety@transitops.com", role: "Safety Officer", status: "Active", created_on: "05 Jun 2026" },
  { name: "John M.", email: "finance@transitops.com", role: "Financial Analyst", status: "Active", created_on: "05 Jun 2026" }
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin": return "bg-purple-100/80 text-purple-700 border-purple-200";
    case "Fleet Manager": return "bg-blue-100/80 text-blue-700 border-blue-200";
    case "Dispatcher": return "bg-orange-100/80 text-orange-700 border-orange-200";
    case "Safety Officer": return "bg-green-100/80 text-green-700 border-green-200";
    case "Financial Analyst": return "bg-amber-100/80 text-amber-700 border-amber-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const getStatusColor = (status: string) => {
  if (status === "Active") return "bg-green-100/80 text-green-700 border-green-200";
  return "bg-slate-100 text-slate-500 border-slate-200";
};

interface UserFormData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export default function UserManagement() {
  const currentUser = useAuthStore((s) => s.user);
  
  // Route guard for non-admins
  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<UserFormData>({
    defaultValues: {
      role: "Fleet Manager",
      status: "Active"
    }
  });

  const onSubmit = (data: UserFormData) => {
    const newUser: UserAccount = {
      name: data.fullName,
      email: data.email,
      role: data.role,
      status: data.status,
      created_on: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto max-w-[1600px] mx-auto gap-6 lg:gap-8 pb-10 pr-2 lg:pr-4">
      
      {/* Page Title + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shrink-0 animate-fade-in mb-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            User Management
          </h1>
          <p className="text-xs font-medium mt-1 text-slate-500">
            Create and manage system accounts
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent-hover transition-colors shadow-sm"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="flex-1 flex flex-col glass-panel overflow-hidden animate-fade-in" style={{ animationDelay: '50ms' }}>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-8 py-5 font-semibold">Name</th>
                <th className="px-8 py-5 font-semibold">Email</th>
                <th className="px-8 py-5 font-semibold">Role</th>
                <th className="px-8 py-5 font-semibold text-center">Status</th>
                <th className="px-8 py-5 font-semibold text-right">Created On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-800">{user.name}</td>
                  <td className="px-8 py-5 text-slate-600">{user.email}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-slate-600 text-right tabular-nums">{user.created_on}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-slate-800">Add New User</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Full Name</label>
                <input
                  {...register("fullName", { required: true })}
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Email</label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="name@transitops.com"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Password</label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="Set initial password"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Role</label>
                  <select
                    {...register("role", { required: true })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Fleet Manager">Fleet Manager</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Status</label>
                  <select
                    {...register("status", { required: true })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 mt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
