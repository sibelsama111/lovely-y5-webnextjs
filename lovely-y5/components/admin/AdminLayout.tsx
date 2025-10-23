'use client'

import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Container, Nav, Navbar, Alert } from 'react-bootstrap'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

type AdminLayoutProps = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useContext(AuthContext)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || !user.isWorker) {
      setError('No tienes permisos para acceder a esta sección')
    }
  }, [user])

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Panel Admin</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Link href="/admin/dashboard" passHref legacyBehavior>
                <Nav.Link>Dashboard</Nav.Link>
              </Link>
              <Link href="/admin/productos" passHref legacyBehavior>
                <Nav.Link>Productos</Nav.Link>
              </Link>
              <Link href="/admin/pedidos" passHref legacyBehavior>
                <Nav.Link>Pedidos</Nav.Link>
              </Link>
              <Link href="/admin/contacto" passHref legacyBehavior>
                <Nav.Link>Contacto</Nav.Link>
              </Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={logout}>Cerrar Sesión</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="flex-grow-1 my-4">
        {children}
      </Container>
    </div>
  )
}