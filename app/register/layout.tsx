export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full">
      <div className="w-full">{children}</div>
    </section>
  );
}
