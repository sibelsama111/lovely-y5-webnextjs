'use client';
import dynamic from 'next/dynamic';
const PerfilPage = dynamic(() => import('../../archive/pages_backup/perfil'), { ssr: false });

export default function PerfilWrapper(){
  return <PerfilPage />;
}
