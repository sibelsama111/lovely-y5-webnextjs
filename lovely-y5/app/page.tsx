// app/page.tsx
'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'

type Product = {
  id: string;
  codigo: string;
  nombre: string;
  marca: string;
  tipo: string;
  precio: number;
  imagenes?: string[];
  descripcion: string;
  detalles: string;
  stock: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data.slice(0, 3)))
  }, [])

  return (
    <div>
      <div className="p-4 bg-white rounded shadow-sm">
        <h1>Bienvenid@ a Lovely Y5</h1>
        <p className="lead">Ventas de tecnología y servicio técnico.</p>
        <p>
          <Link href="/productos" className="btn btn-primary me-2">Ver Productos</Link>
          <Link href="/contacto" className="btn btn-outline-secondary">Contacto</Link>
        </p>
      </div>

      <div className="mt-4">
        <h3>Ofertas destacadas</h3>
        <div className="row g-3">
          {products.map(product => (
            <div key={product.id} className="col-md-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Nueva sección: Sobre nosotros */}
      <div className="mt-5 p-4 bg-white rounded shadow-sm">
        <h3>Sobre nosotros &lt;3</h3>
        <p style={{whiteSpace:'pre-wrap', textAlign:'justify'}}>
          En un mundo digital que se mueve a velocidades vertiginosas, la tecnología ha dejado de ser un lujo para convertirse en una extensión de nuestras vidas. Sin embargo, con esta integración surge una necesidad crítica: la confianza. Necesitamos soluciones que no solo funcionen, sino en las que podamos confiar; necesitamos expertos que no solo reparen, sino que comprendan el valor de lo que están manejando. Es en esta intersección de necesidad y conocimiento donde nace Lovely Y5, un emprendimiento visionario dedicado a la venta de tecnología y al servicio técnico de primer nivel.

Lovely Y5 no es simplemente una tienda más o un servicio de reparación genérico. Es un proyecto forjado desde los cimientos del conocimiento académico riguroso y la pasión por la innovación. Su origen se encuentra en la mente de un estudiante de Ingeniería Informática en el prestigioso IP DUOC UC, una institución reconocida por su excelencia y su enfoque práctico. Esta base académica no es un simple dato; es la garantía fundamental de que cada servicio, cada recomendación y cada producto ofrecido por Lovely Y5 está respaldado por una comprensión profunda y actualizada de los sistemas, el software y el hardware que definen nuestro tiempo.

Actualmente, el proyecto Lovely Y5 cumple un doble propósito extraordinario. Por un lado, ya está operando activamente, ofreciendo servicios de reparación y venta a clientes que buscan soluciones efectivas y fiables. Por otro, sirve como un pilar central en la formación de su fundador, siendo un proyecto activo utilizado para las evaluaciones del instituto. Esta simbiosis es, quizás, la mayor fortaleza de Lovely Y5. No se trata de teoría estancada en un aula; es la aplicación directa y probada del conocimiento. Cada desafío resuelto para un cliente es también una lección aprendida y evaluada, lo que beneficia al proyecto al "aprender a elevar páginas y apps al mundo real". Esto asegura que Lovely Y5 esté en un estado de mejora continua, refinando sus procesos y manteniéndose a la vanguardia.

Un Servicio Técnico Basado en la Precisión

La confiabilidad de un servicio técnico se mide en su precisión, transparencia y resultados. Lovely Y5 se construye sobre estos pilares. Al estar arraigado en los estudios de Ingeniería Informática, el enfoque de diagnóstico y reparación va más allá de la simple sustitución de piezas. Se trata de entender el problema a nivel de sistema, de optimizar el rendimiento y de asegurar una solución duradera. Los clientes pueden confiar en que no recibirán jergas técnicas incomprensibles, sino explicaciones claras y soluciones honestas, un compromiso que se deriva directamente de la ética profesional inculcada en DUOC UC.

Una Identidad que Refleja la Misión

La identidad visual de Lovely Y5 es una declaración de principios. El logo, un corazón con líneas de señal, captura perfectamente la esencia del negocio. El "corazón" simboliza la pasión por la tecnología, el compromiso con el cliente y un servicio humanizado, algo que a menudo se pierde en la industria tecnológica. Las "líneas de señal" representan la conectividad, la comunicación fluida y la pericia técnica. Es la unión de lo humano y lo digital.

Esta dualidad se refuerza con la paleta de colores y la tipografía. El color principal, #FFACCA, un tono rosa suave y accesible, rompe audazmente con los fríos azules y grises corporativos que dominan el sector. Este color transmite cercanía, transparencia y modernidad, invitando a los clientes a interactuar sin intimidación. Complementando esto, el uso de la fuente Consolas —una tipografía limpia, monoespaciada y asociada al mundo de la programación— aporta el contrapeso perfecto. Subcomunica claridad, precisión, orden y una base técnica sólida. El mensaje es claro: Lovely Y5 es un negocio amigable y accesible, pero con una seriedad y competencia técnica incuestionables.

Un Proyecto que es Promesa de Futuro

Lovely Y5 es, en palabras de su creador, la representación de "todo lo aprendido estudiando Ingeniería Informática en DUOC UC". Es un portafolio vivo, un testimonio de dedicación y un motor de crecimiento. Aunque el proyecto aún se encuentra en una fase de desarrollo y refinamiento estratégico, su ejecución actual de servicios de reparación y venta demuestra su viabilidad y su compromiso con el presente.

La visión a largo plazo es clara: llevar a Lovely Y5 a un modelo de negocio real y escalable. Esta ambición es una excelente noticia para sus clientes actuales y futuros. Significa que están tratando con un proyecto que no se conforma, que busca la excelencia y que está construyendo una reputación a largo plazo. Elegir Lovely Y5 no es solo contratar un servicio; es apoyar un proyecto con una base sólida, un presente funcional y un futuro prometedor. Es depositar la confianza en un profesional que no solo vende y repara tecnología, sino que la estudia, la aplica y la vive cada día con el objetivo de llevar soluciones del más alto nivel al mundo real.
        </p>
      </div>
    </div>
  )
}
