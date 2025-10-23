const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'lovely5.techserv@gmail.com';

function money(n){ return Number(n||0).toLocaleString('es-CL'); }

function orderItemsHtml(items){
  return `<ul>` + (items||[]).map(it=>`<li>${it.nombre} | x${it.cantidad} | $${money(it.precio)} | subtotal: $${money((it.precio||0)*(it.cantidad||1))}</li>`).join('') + `</ul>`;
}

export function orderConfirmationClient(order){
  const subj = `#${order.id} Gracias por confiar en LovelyY5 <3`;
  const shipping = order.shipping || {};
  const subtotal = (order.items||[]).reduce((s,i)=> s + ((i.precio||0)*(i.cantidad||1)), 0);
  const envio = 5000;
  const total = (order.total != null) ? order.total : (subtotal + envio);
  const html = `
    <p>Estimado/a ${shipping.nombre || ''},</p>
    <p>Gracias por efectuar una compra con nosotros y confiar en nuestros productos. No te preocupes si algo sale mal, tenemos garantía del producto y en el peor de los casos reembolso del <strong>90%</strong> del total de la compra (sin contar envío).</p>
    <p><strong>Datos para el envío:</strong> ${shipping.direccion || shipping.direccionEnvio || ''} — recibe: ${shipping.nombre || ''} — RUT: ${shipping.rut || ''} — Tel: ${shipping.telefono || shipping.numero || ''}</p>
    <p><strong>Detalle de tu pedido #${order.id}:</strong></p>
    ${orderItemsHtml(order.items)}
    <p>Subtotal: $${money(subtotal)}</p>
    <p>Envío: $${money(envio)}</p>
    <p><strong>Total: $${money(total)}</strong></p>
    <p>Su pedido ha sido recepcionado exitosamente! Espere noticias a través de correo electrónico o en su cuenta (¿aún no te registras? <a href="${SITE}/registro" target="_blank">click aquí</a>).</p>
    <p>Gracias por confiar en nosotros! &lt;3</p>
    <p>Lovely Y5 &lt;3<br/>${ADMIN_EMAIL}<br/><a href="https://instagram.com" target="_blank">Instagram</a> | <a href="https://facebook.com" target="_blank">Facebook</a> | <a href="${SITE}" target="_blank">Sitio Web</a></p>
  `;
  const text = `Estimado/a ${shipping.nombre || ''}\nGracias por efectuar una compra. Detalle pedido: ${order.items.map(i=>`${i.nombre} x${i.cantidad} $${money(i.precio)}`).join(', ')}\nTotal: $${money(total)}.`;
  return { subject: subj, html, text };
}

export function orderNotificationAdmin(order){
  const subj = `#${order.id} Ha llegado un nuevo pedido! [${order.shipping?.rut || ''}]`;
  const shipping = order.shipping || {};
  const subtotal = (order.items||[]).reduce((s,i)=> s + ((i.precio||0)*(i.cantidad||1)), 0);
  const envio = 5000;
  const total = (order.total != null) ? order.total : (subtotal + envio);
  const html = `
    <p>${shipping.nombre || ''} ha efectuado una compra!</p>
    <p><strong>Datos para el envío:</strong> ${shipping.direccion || ''} — recibe: ${shipping.nombre || ''} — RUT: ${shipping.rut || ''} — Tel: ${shipping.telefono || shipping.numero || ''}</p>
    <p><strong>Detalle del pedido #${order.id}:</strong></p>
    ${orderItemsHtml(order.items)}
    <p>Subtotal: $${money(subtotal)}</p>
    <p>Envío: $${money(envio)}</p>
    <p><strong>Total: $${money(total)}</strong></p>
    <p>El pedido ha sido recepcionado exitosamente! Por favor, actualice al cliente lo antes posible. Ingresa a INTRALOVE: <a href="${SITE}/admin/login" target="_blank">Login Intranet</a></p>
    <p>Gracias por trabajar con nosotros! &lt;3</p>
    <p>Lovely Y5 &lt;3<br/>${ADMIN_EMAIL}<br/><a href="https://instagram.com" target="_blank">Instagram</a> | <a href="https://facebook.com" target="_blank">Facebook</a> | <a href="${SITE}" target="_blank">Sitio Web</a></p>
  `;
  const text = `${shipping.nombre || ''} ha efectuado una compra. Total: $${money(total)}. Revisa la intranet: ${SITE}/admin/login`;
  return { to: ADMIN_EMAIL, subject: subj, html, text };
}

export function orderStatusUpdateClient(order, newStatus, extra={}){
  const subj = `Tu pedido #${order.id} ha recibido una actualización!`;
  const shipping = order.shipping || {};
  const subtotal = (order.items||[]).reduce((s,i)=> s + ((i.precio||0)*(i.cantidad||1)), 0);
  const envio = 5000;
  const total = (order.total != null) ? order.total : (subtotal + envio);
  const trackingHtml = extra.tracking ? `<p><strong>Empresa de envío:</strong> ${extra.courier || ''}<br/><strong>Tracking:</strong> ${extra.tracking}</p>` : '';
  const html = `
    <p>Estimado/a ${shipping.nombre || ''},</p>
    <p>Tu pedido ha cambiado a <strong>${newStatus}</strong>.</p>
    <p><strong>Datos para el envío:</strong> ${shipping.direccion || ''} — recibe: ${shipping.nombre || ''} — RUT: ${shipping.rut || ''} — Tel: ${shipping.telefono || shipping.numero || ''}</p>
    ${trackingHtml}
    <p><strong>Detalle del pedido #${order.id}:</strong></p>
    ${orderItemsHtml(order.items)}
    <p>Subtotal: $${money(subtotal)}</p>
    <p>Envío: $${money(envio)}</p>
    <p><strong>Total: $${money(total)}</strong></p>
    <p>Pronto recibirás noticias a través de correo electrónico o en tu cuenta (¿aún no te registras? <a href="${SITE}/registro" target="_blank">click aquí</a>).</p>
    <p>Gracias por confiar en nosotros! &lt;3</p>
    <p>Lovely Y5 &lt;3<br/>${ADMIN_EMAIL}<br/><a href="https://instagram.com" target="_blank">Instagram</a> | <a href="https://facebook.com" target="_blank">Facebook</a> | <a href="${SITE}" target="_blank">Sitio Web</a></p>
  `;
  const text = `Tu pedido ${order.id} ha cambiado a ${newStatus}. Total: $${money(total)}.`;
  return { subject: subj, html, text };
}

export function refundNotificationClient(order, amount){
  const subj = `Reembolso pedido #${order.id}`;
  const html = `<p>Estimado/a ${order.shipping?.nombre || ''},</p><p>Se ha procesado un reembolso por tu pedido <strong>#${order.id}</strong> por un monto aproximado de <strong>$${money(amount)}</strong>. Esto corresponde al 90% del total según la política.</p><p>Lovely Y5</p>`;
  const text = `Reembolso pedido ${order.id} por $${money(amount)}.`;
  return { subject: subj, html, text };
}
