'use client';
import dynamic from 'next/dynamic';
const ConfirmacionPage = dynamic(() => import('../../archive/pages_backup/confirmacion'), { ssr: false });

export default function ConfirmacionWrapper(){
  return <ConfirmacionPage />;
}
