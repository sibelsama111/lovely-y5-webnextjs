'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function Page(){
  const params = useParams();
  useEffect(()=>{
    if (params?.id && typeof window !== 'undefined'){
      // redirect to legacy pages route where the implementation exists
      window.location.href = `/producto/${params.id}`;
    }
  },[params]);
  return null;
}
