'use client';
import dynamic from 'next/dynamic';
const CarritoPage = dynamic(() => import('../../archive/pages_backup/carrito'), { ssr: false });

export default function CarritoWrapper(){
  return <CarritoPage />;
}
