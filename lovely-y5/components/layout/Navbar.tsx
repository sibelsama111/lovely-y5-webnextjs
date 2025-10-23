'use client'

import { useContext } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import Link from 'next/link'
import { AuthContext } from '../../context/AuthContext'

export default function MainNavbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <Navbar bg="white" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand href="/">Lovely Y5</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Link href="/productos" passHref legacyBehavior>
              <Nav.Link>Productos</Nav.Link>
            </Link>
            <Link href="/contacto" passHref legacyBehavior>
              <Nav.Link>Contacto</Nav.Link>
            </Link>
          </Nav>
          <Nav>
            {!user ? (
              <>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link>Iniciar Sesión</Nav.Link>
                </Link>
                <Link href="/registro" passHref legacyBehavior>
                  <Nav.Link>Registrarse</Nav.Link>
                </Link>
              </>
            ) : (
              <>
                <Link href="/perfil" passHref legacyBehavior>
                  <Nav.Link>Mi Perfil</Nav.Link>
                </Link>
                <Nav.Link onClick={logout}>Cerrar Sesión</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}