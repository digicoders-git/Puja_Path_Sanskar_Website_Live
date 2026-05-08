const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-gray-500">Page not found.</p>
      <a href="/" className="text-blue-500 hover:underline">Go Home</a>
    </div>
  )
}

export default NotFound
