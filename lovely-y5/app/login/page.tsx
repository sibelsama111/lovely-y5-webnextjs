'use client';
import dynamic from 'next/dynamic';
const LoginPage = dynamic(() => import('../../archive/pages_backup/login'), { ssr: false });

export default function LoginWrapper(){
  return <LoginPage />;
}
