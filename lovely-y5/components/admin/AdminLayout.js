import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth(); // Reutilizamos el AuthContext

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Link href="/admin/dashboard" passHref>
            <Navbar.Brand>
              <Image src="/logo-intralove.svg" width={30} height={30} alt="Logo IntraLove" />
              {' '}IntraLove
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          <Navbar.Collapse id="admin-navbar-nav">
            {/* Los botones solo aparecen si está logueado como admin */}
            {user && user.role === 'worker' && (
              <Nav className="ms-auto">
                <Link href="/admin/dashboard" passHref><Nav.Link>Dashboard</Nav.Link></Link>
                <Link href="/admin/pedidos" passHref><Nav.Link>Pedidos</Nav.Link></Link>
                <Link href="/admin/productos" passHref><Nav.Link>Productos</Nav.Link></Link>
                <Link href="/admin/contacto" passHref><Nav.Link>Contacto</Nav.Link></Link>
                <NavDropdown title={user.primernombre} id="admin-nav-dropdown">
                  <Link href="/admin/perfil" passHref><NavDropdown.Item>Perfil</NavDropdown.Item></Link>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Cerrar Sesión</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="my-4">
        {children}
      </Container>
    </>
  );
}