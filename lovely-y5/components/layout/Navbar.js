import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext'; // (Lo crearemos)

export default function MainNavbar() {
  const { user, logout } = useAuth(); // Estado global de Auth

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>
            <Image src="/logo-lovely5.svg" width={30} height={30} alt="Logo Lovely Y5" />
            {' '}Lovely Y5
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Link href="/" passHref><Nav.Link>Inicio</Nav.Link></Link>
            <Link href="/productos" passHref><Nav.Link>Productos</Nav.Link></Link>
            <Link href="/contacto" passHref><Nav.Link>Contacto</Nav.Link></Link>
            {user ? (
              <>
                <Nav.Link disabled style={{ color: 'hotpink' }}>
                  Hola, {user.primernombre}! &lt;3
                </Nav.Link>
                <NavDropdown title="Mi Cuenta" id="basic-nav-dropdown">
                  <Link href="/perfil" passHref><NavDropdown.Item>Perfil</NavDropdown.Item></Link>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Cerrar Sesión</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Link href="/login" passHref><Nav.Link>Iniciar Sesión</Nav.Link></Link>
            )}
            <Link href="/carrito" passHref><Nav.Link>Carrito</Nav.Link></Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}