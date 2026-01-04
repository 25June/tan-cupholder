// Reusable error display component
const FieldErrors = ({ id, errors }: { id: string; errors?: string[] }) => {
  if (!errors?.length) return null;
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors.map((error: string) => (
        <p className="text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
};

export default FieldErrors;
