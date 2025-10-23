'use client';
import dynamic from 'next/dynamic';
const ContactoPage = dynamic(() => import('../../archive/pages_backup/contacto'), { ssr: false });

export default function ContactoWrapper(){
  return <ContactoPage />;
}
