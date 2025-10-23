import { Container, Nav } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <Container as="footer" className="text-center py-4 mt-5">
      <Nav className="justify-content-center" style={{ opacity: 0.7 }}>
        <Link href="/" passHref><Nav.Link>Inicio</Nav.Link></Link>
        <Link href="/productos" passHref><Nav.Link>Productos</Nav.Link></Link>
        <Link href="/contacto" passHref><Nav.Link>Contacto</Nav.Link></Link>
        <Link href="/login" passHref><Nav.Link>Iniciar Sesión</Nav.Link></Link>
      </Nav>
      <div className="my-3">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">
          <Image src="/facebook.svg" width={24} height={24} alt="Facebook" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2">
          <Image src="/instagram.svg" width={24} height={24} alt="Instagram" />
        </a>
        <a href="https://mercadolibre.com" target="_blank" rel="noopener noreferrer" className="mx-2">
          <Image src="/mercadolibre.svg" width={24} height={24} alt="MercadoLibre" />
        </a>
      </div>
      <p>Todos los derechos reservados (c) Lovely Y5 &lt;3</p>
    </Container>
  );
}