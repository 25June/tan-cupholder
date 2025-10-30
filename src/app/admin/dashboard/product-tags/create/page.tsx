import { Metadata } from 'next';
import { lusitana } from '@/app/admin/ui/fonts';
import CreateProductTagForm from '@/app/admin/ui/product-tags/create-form';

export const metadata: Metadata = {
  title: 'Create Product Tag'
};

export default function Page() {
  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>
          Create Product Tag
        </h1>
      </div>
      <CreateProductTagForm />
    </main>
  );
}
