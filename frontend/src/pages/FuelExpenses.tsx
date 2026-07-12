import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Plus, X } from "lucide-react";

interface FuelLog {
  vehicle: string;
  date: string;
  liters: string;
  fuel_cost: string;
}

interface OtherExpense {
  trip: string;
  vehicle: string;
  toll: string;
  other: string;
  maint_linked: string;
  total_status: string;
  description?: string;
}

const initialFuelLogs: FuelLog[] = [
  { vehicle: "VAN-05", date: "05 Jul 2026", liters: "42 L", fuel_cost: "3,150" },
  { vehicle: "TRUCK-11", date: "06 Jul 2026", liters: "110 L", fuel_cost: "8,400" },
  { vehicle: "MINI-03", date: "06 Jul 2026", liters: "28 L", fuel_cost: "2,050" }
];

const initialOtherExpenses: OtherExpense[] = [
  { trip: "TR001", vehicle: "VAN-05", toll: "120", other: "0", maint_linked: "0", total_status: "Available" },
  { trip: "TR002", vehicle: "TRK-12", toll: "340", other: "150", maint_linked: "18,000", total_status: "Completed" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-blue-100/80 text-blue-700 border-blue-200";
    case "Available":
      return "bg-green-100/80 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const parseNum = (val: string) => {
  if (!val) return 0;
  return parseInt(val.replace(/[^\d.-]/g, ''), 10) || 0;
};

interface FuelFormData {
  vehicle: string;
  date: string;
  liters: number;
  fuel_cost: number;
}

interface ExpenseFormData {
  trip: string;
  vehicle: string;
  toll: number;
  other: number;
  description: string;
}

export default function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initialFuelLogs);
  const [otherExpenses, setOtherExpenses] = useState<OtherExpense[]>(initialOtherExpenses);
  
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const fuelForm = useForm<FuelFormData>({
    defaultValues: { vehicle: "VAN-05" }
  });

  const expenseForm = useForm<ExpenseFormData>({
    defaultValues: { trip: "TR001", vehicle: "VAN-05", toll: 0, other: 0 }
  });

  const onFuelSubmit = (data: FuelFormData) => {
    setFuelLogs([
      {
        vehicle: data.vehicle,
        date: data.date,
        liters: `${data.liters} L`,
        fuel_cost: data.fuel_cost.toLocaleString()
      },
      ...fuelLogs
    ]);
    setIsFuelModalOpen(false);
    fuelForm.reset();
  };

  const onExpenseSubmit = (data: ExpenseFormData) => {
    setOtherExpenses([
      {
        trip: data.trip,
        vehicle: data.vehicle,
        toll: data.toll.toLocaleString(),
        other: data.other.toLocaleString(),
        maint_linked: "0",
        total_status: "Available",
        description: data.description
      },
      ...otherExpenses
    ]);
    setIsExpenseModalOpen(false);
    expenseForm.reset();
  };

  const totalCost = useMemo(() => {
    let sum = 0;
    fuelLogs.forEach(log => sum += parseNum(log.fuel_cost));
    otherExpenses.forEach(exp => {
      sum += parseNum(exp.toll) + parseNum(exp.other) + parseNum(exp.maint_linked);
    });
    return sum;
  }, [fuelLogs, otherExpenses]);

  return (
    <div className="flex flex-col h-full overflow-y-auto max-w-[1600px] mx-auto gap-6 lg:gap-8 pb-10 pr-2 lg:pr-4">
      
      {/* Page Title + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shrink-0 animate-fade-in mb-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Fuel & Expenses
          </h1>
          <p className="text-xs font-medium mt-1 text-slate-500">
            Track operational costs across the fleet
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="glass-panel p-6 lg:p-8 flex flex-col sm:flex-row gap-6 justify-between items-center shrink-0 animate-fade-in mb-6" style={{ animationDelay: '50ms' }}>
        <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsFuelModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Plus size={16} /> Log Fuel
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-800 border-2 border-slate-200 rounded-lg text-sm font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN - Fuel Logs Table */}
        <div className="flex-[2] flex flex-col glass-panel overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="p-5 lg:p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl shrink-0 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Fuel Logs</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-8 py-5 font-semibold">Date</th>
                  <th className="px-8 py-5 font-semibold">Vehicle</th>
                  <th className="px-8 py-5 font-semibold text-right">Liters</th>
                  <th className="px-8 py-5 font-semibold text-right">Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fuelLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-5 text-slate-600">{log.date}</td>
                    <td className="px-8 py-5 font-medium text-slate-800">{log.vehicle}</td>
                    <td className="px-8 py-5 text-slate-600 text-right tabular-nums">{log.liters}</td>
                    <td className="px-8 py-5 text-slate-600 text-right tabular-nums font-medium">₹{log.fuel_cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN - Other Expenses Table */}
        <div className="flex-[3] flex flex-col glass-panel overflow-hidden animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="p-5 lg:p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl shrink-0 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Other Expenses</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-8 py-5 font-semibold">Trip / Ref</th>
                  <th className="px-8 py-5 font-semibold text-right">Toll</th>
                  <th className="px-8 py-5 font-semibold text-right">Maint. Linked</th>
                  <th className="px-8 py-5 font-semibold text-right">Misc</th>
                  <th className="px-8 py-5 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {otherExpenses.map((exp, idx) => {
                  const rowTotal = parseNum(exp.toll) + parseNum(exp.other) + parseNum(exp.maint_linked);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-5 font-medium text-slate-800">{exp.trip}</td>
                      <td className="px-8 py-5 text-slate-600 text-right tabular-nums">₹{exp.toll}</td>
                      <td className="px-8 py-5 text-slate-600 text-right tabular-nums">₹{exp.maint_linked}</td>
                      <td className="px-8 py-5 text-slate-600 text-right tabular-nums">₹{exp.other}</td>
                      <td className="px-8 py-5 text-right">
                        <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(exp.total_status)}`}>
                          ₹{rowTotal.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cost Summary Banner */}
      <div className="glass-panel p-6 lg:p-8 flex items-center justify-between bg-slate-800 border-slate-700 shadow-md animate-fade-in shrink-0" style={{ animationDelay: '200ms' }}>
        <div className="text-sm font-semibold text-slate-300">
          Total Operational Cost (Auto) = Fuel + Maint.
        </div>
        <div className="text-xl font-black text-amber-500 tracking-tight">
          ₹{totalCost.toLocaleString()}
        </div>
      </div>

      {/* Log Fuel Modal */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Log Fuel</h2>
              <button onClick={() => setIsFuelModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={fuelForm.handleSubmit(onFuelSubmit)} className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Vehicle</label>
                <select
                  {...fuelForm.register("vehicle", { required: true })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                >
                  <option value="VAN-05">VAN-05</option>
                  <option value="TRUCK-11">TRUCK-11</option>
                  <option value="MINI-03">MINI-03</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Date</label>
                <input
                  {...fuelForm.register("date", { required: true })}
                  type="text"
                  placeholder="DD MMM YYYY"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Liters</label>
                <input
                  {...fuelForm.register("liters", { required: true, valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Fuel Cost (₹)</label>
                <input
                  {...fuelForm.register("fuel_cost", { required: true, valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFuelModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
                >
                  Log Fuel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Add Expense</h2>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Trip ID</label>
                <select
                  {...expenseForm.register("trip", { required: true })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                >
                  <option value="TR001">TR001</option>
                  <option value="TR002">TR002</option>
                  <option value="TR003">TR003</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Vehicle</label>
                <select
                  {...expenseForm.register("vehicle", { required: true })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer"
                >
                  <option value="VAN-05">VAN-05</option>
                  <option value="TRUCK-11">TRUCK-11</option>
                  <option value="TRK-12">TRK-12</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Toll (₹)</label>
                  <input
                    {...expenseForm.register("toll", { valueAsNumber: true })}
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Other (₹)</label>
                  <input
                    {...expenseForm.register("other", { valueAsNumber: true })}
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Description</label>
                <input
                  {...expenseForm.register("description")}
                  type="text"
                  placeholder="e.g. Parking fee"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
