'use client';
import dynamic from 'next/dynamic';
const ProductosPage = dynamic(() => import('../../archive/pages_backup/productos'), { ssr: false });

export default function ProductosWrapper(){
  return <ProductosPage />;
}
