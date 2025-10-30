export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-xl font-semibold">Product Tag Not Found</h2>
      <p className="text-gray-600 mt-2">
        The product tag you are looking for does not exist.
      </p>
    </div>
  );
}
