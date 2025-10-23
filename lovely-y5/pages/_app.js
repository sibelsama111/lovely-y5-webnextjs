import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { Container } from 'react-bootstrap';
import MainNavbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingCartButton from '../components/layout/FloatingCartButton';
import { AuthProvider } from '../context/AuthContext'; // Importar
import { CartProvider } from '../context/CartContext'; // Importar
import { useRouter } from 'next/router';
import AdminLayout from '../components/admin/AdminLayout'; // (Lo crearemos)

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Lógica para mostrar el layout de Admin o de Cliente
  if (router.pathname.startsWith('/admin')) {
    return (
      <AuthProvider> {/* El AuthContext sirve para ambos */}
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      </AuthProvider>
    );
  }

  // Layout de Cliente
  return (
    <AuthProvider>
      <CartProvider>
        <MainNavbar />
        <Container className="my-4" style={{ minHeight: '70vh' }}>
          <Component {...pageProps} />
        </Container>
        <FloatingCartButton />
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;