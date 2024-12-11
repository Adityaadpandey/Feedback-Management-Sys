export default function DashboardLayout({
  forms,
  responses,
}: {
  children: React.ReactNode;
  forms: React.ReactNode;
  responses: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>{forms}</div>
        <div>{responses}</div>
      </div>
    </div>
  );
}
