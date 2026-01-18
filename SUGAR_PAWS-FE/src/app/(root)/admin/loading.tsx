"use client";

export default function AdminLoading() {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
