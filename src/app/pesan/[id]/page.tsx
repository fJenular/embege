import prisma from "@/lib/prisma";
import OrderForm from "./OrderForm";
import { notFound } from "next/navigation";

export default async function PesanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const paketId = BigInt(resolvedParams.id);
  
  const paket = await prisma.pakets.findUnique({
    where: { id: paketId }
  });

  if (!paket) {
    return notFound();
  }

  // Convert BigInt to string for Client Component safety
  const safePaket = {
    ...paket,
    id: paket.id.toString(),
  };

  return <OrderForm paket={safePaket} />;
}
