export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Affiliate Growth Platform
        </h1>
        <p className="text-gray-400 mt-1">
          Germany Market — Automated Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Traffic</p>
          <p className="text-2xl font-bold text-white mt-1">—</p>
          <p className="text-xs text-gray-500 mt-1">Waiting for backend</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Ad Spend</p>
          <p className="text-2xl font-bold text-white mt-1">—</p>
          <p className="text-xs text-gray-500 mt-1">Waiting for backend</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Est. Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">—</p>
          <p className="text-xs text-gray-500 mt-1">Waiting for backend</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Active Niches</p>
          <p className="text-2xl font-bold text-white mt-1">—</p>
          <p className="text-xs text-gray-500 mt-1">Waiting for backend</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <p className="text-gray-400 text-center">
          Day 1 Complete ✅ — Dashboard shell is ready. Full screens coming Day 2.
        </p>
      </div>
    </div>
  );
}
