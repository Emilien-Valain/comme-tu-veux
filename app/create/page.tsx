import Form from "@/app/ui/create-form";
// import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
// import { fetchCustomers } from "@/app/lib/data";

export const metadata = {
  title: "Create Contest",
};

export default async function Page() {
  //   const customers = await fetchCustomers();

  return (
    <main>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Create Invoice",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      /> */}
      <Form />
    </main>
  );
}
