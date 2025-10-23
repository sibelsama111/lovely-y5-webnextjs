const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'lovely5.techserv@gmail.com';

function money(n){ return Number(n||0).toLocaleString('es-CL'); }

function orderItemsHtml(items){
  return `<ul>` + (items||[]).map(it=>`<li>${it.nombre} | x${it.quantity} | $${money(it.precio)} | subtotal: $${money((it.precio||0)*(it.quantity||1))}</li>`).join('') + `</ul>`;
}

// 🧾 1. Confirmación de pedido
export function orderConfirmationClient(order){
  const subj = `#${order.id} Gracias por confiar en LovelyY5 <3`;
  const shipping = order.shipping || {};
  const subtotal = (order.items||[]).reduce((s,i)=> s + ((i.precio||0)*(i.quantity||1)), 0);
  const envio = 5000;
  const total = (order.total != null) ? order.total : (subtotal + envio);
  const html = `
    <p>Estimado/a ${shipping.name || ''},</p>
    <p>¡Tu pedido ha sido confirmado exitosamente!</p>
    <p><strong>Datos de envío:</strong> ${shipping.address || ''} — recibe: ${shipping.name || ''} — Tel: ${shipping.phone || ''}</p>
    ${orderItemsHtml(order.items)}
    <p>Subtotal: $${money(subtotal)}</p>
    <p>Envío: $${money(envio)}</p>
    <p><strong>Total: $${money(total)}</strong></p>
    <p>Nos encargaremos de prepararlo lo antes posible. Recibirás notificaciones sobre cada paso!</p>
    <p>Lovely Y5 &lt;3<br/>${ADMIN_EMAIL}<br/><a href="${SITE}" target="_blank">Sitio Web</a></p>
  `;
  const text = `Pedido confirmado ${order.id}. Total: $${money(total)}.`;
  return { subject: subj, html, text };
}

export function orderConfirmationAdmin(order){
  const subj = `#${order.id} Nuevo pedido confirmado`;
  const shipping = order.shipping || {};
  const subtotal = (order.items||[]).reduce((s,i)=> s + ((i.precio||0)*(i.cantidad||1)), 0);
  const envio = 5000;
  const total = (order.total != null) ? order.total : (subtotal + envio);
  const html = `
    <p>${shipping.nombre || ''} ha confirmado un pedido.</p>
    ${orderItemsHtml(order.items)}
    <p>Total: $${money(total)}</p>
    <p>Actualizar estado en: <a href="${SITE}/admin/login" target="_blank">Intranet LovelyY5</a></p>
  `;
  const text = `${shipping.nombre || ''} confirmó un pedido. Total: $${money(total)}.`;
  return { to: ADMIN_EMAIL, subject: subj, html, text };
}

// 2. Pedido preparando
export function orderPreparingClient(order){
  const subj = `Tu pedido #${order.id} está siendo preparado 💖`;
  const shipping = order.shipping || {};
  const html = `
    <p>Estimado/a ${shipping.nombre || ''},</p>
    <p>Tu pedido ya está siendo preparado por nuestro equipo. Pronto será despachado 🚚</p>
    ${orderItemsHtml(order.items)}
    <p>Gracias por confiar en Lovely Y5 &lt;3</p>
  `;
  const text = `Tu pedido ${order.id} está siendo preparado.`;
  return { subject: subj, html, text };
}

// 3. Pedido enviado
export function orderShippedClient(order, courier, tracking){
  const subj = `Tu pedido #${order.id} fue enviado 🚀`;
  const shipping = order.shipping || {};
  const html = `
    <p>Estimado/a ${shipping.nombre || ''},</p>
    <p>Tu pedido ha sido despachado con éxito.</p>
    <p><strong>Courier:</strong> ${courier || '—'}<br/><strong>Tracking:</strong> ${tracking || '—'}</p>
    <p>Puedes seguir tu envío en el sitio del courier con el número indicado.</p>
    ${orderItemsHtml(order.items)}
    <p>Lovely Y5 &lt;3</p>
  `;
  const text = `Pedido ${order.id} enviado. Tracking: ${tracking || 'N/A'}.`;
  return { subject: subj, html, text };
}

// 4. Pedido recibido
export function orderReceivedClient(order){
  const subj = `Pedido #${order.id} recibido 💕`;
  const shipping = order.shipping || {};
  const html = `
    <p>Estimado/a ${shipping.nombre || ''},</p>
    <p>Confirmamos que tu pedido ha sido entregado correctamente 🎁</p>
    <p>Esperamos que te encante tu compra. ¡Gracias por elegir Lovely Y5!</p>
    <p>Si tienes algún problema, recuerda que contamos con garantía y reembolsos del 90% según política.</p>
    <p>Lovely Y5 &lt;3</p>
  `;
  const text = `Pedido ${order.id} entregado correctamente.`;
  return { subject: subj, html, text };
}

// 5. Reembolso
export function refundNotificationClient(order, amount){
  const subj = `Reembolso pedido #${order.id}`;
  const html = `
    <p>Estimado/a ${order.shipping?.nombre || ''},</p>
    <p>Se ha procesado un reembolso por tu pedido <strong>#${order.id}</strong> por un monto de <strong>$${money(amount)}</strong>.</p>
    <p>Esto corresponde al 90% del total de la compra, excluyendo costos de envío.</p>
    <p>Lovely Y5 &lt;3</p>
  `;
  const text = `Reembolso pedido ${order.id} por $${money(amount)}.`;
  return { subject: subj, html, text };
}

// 6. Solicitud de contacto
export function contactRequestAdmin(form){
  const subj = `Nuevo mensaje de contacto - ${form.nombre || 'Cliente'}`;
  const html = `
    <p>Nuevo mensaje desde el formulario de contacto:</p>
    <p><strong>Nombre:</strong> ${form.nombre || ''}</p>
    <p><strong>Email:</strong> ${form.email || ''}</p>
    <p><strong>Teléfono:</strong> ${form.telefono || ''}</p>
    <p><strong>Mensaje:</strong><br/>${form.mensaje || ''}</p>
    <p>Responder a: <a href="mailto:${form.email}">${form.email}</a></p>
  `;
  const text = `Nuevo mensaje de ${form.nombre || ''}: ${form.mensaje || ''}`;
  return { to: ADMIN_EMAIL, subject: subj, html, text };
}
