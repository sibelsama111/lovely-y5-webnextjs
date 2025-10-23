'use client';
import dynamic from 'next/dynamic';
const RegistroPage = dynamic(() => import('../../archive/pages_backup/registro'), { ssr: false });

export default function RegistroWrapper(){
  return <RegistroPage />;
}
