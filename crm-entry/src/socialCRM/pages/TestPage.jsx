export default function TestPage() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind Test</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-700">If you see colors and styling, Tailwind is working!</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Test Button
        </button>
      </div>
    </div>
  );
}
