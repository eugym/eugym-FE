// Route protection is handled server-side in app/dashboard/layout.tsx.
// This file is kept as a placeholder to avoid import errors during migration.
// It can be deleted once all imports referencing it are removed.

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
