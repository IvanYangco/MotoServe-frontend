export default function InventoryPage() {
  return (
    <div>
      <h1 className="text-gray-800 text-2xl font-bold ">Inventory</h1>
      <p className="text-gray-600 mt-2">List of motorcycle parts and stock levels.</p>
      <div className="p-4 border rounded-lg mb-7 shadow-sm bg-white text-black-800">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-gray-800">Stock</h2>
        <button
          className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded "
          
        >
          + Add Stock
        </button>
      </div>
      </div>
    </div>
  );
}