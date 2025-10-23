import Link from 'next/link';
import Image from 'next/image';
import styles from './FloatingCart.module.css'; // Necesitarás crear este CSS

/* En FloatingCart.module.css */
/*
.floatingCart {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: hotpink;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 1000;
  transition: transform 0.2s ease;
}
.floatingCart:hover {
  transform: scale(1.1);
}
*/

export default function FloatingCartButton() {
  // Opcional: Podrías usar CartContext para mostrar el número de items
  return (
    <Link href="/carrito" passHref>
      <a className={styles.floatingCart}>
        <Image src="/cart-icon.svg" width={30} height={30} alt="Carrito" />
      </a>
    </Link>
  );
}