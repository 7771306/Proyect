//backend/utils/correo.js

import nodemailer from 'nodemailer';
export async function enviarReciboPorCorreo(destinatario, venta, libro)
{
const transporter = nodemailer.createTransport({
host: 'smtp.office365.com',
port: 587,
secure: false, // Debe ser false para usar STARTTLS
auth: {
user: 'artillero.ssr@gmail.com', // Tu correo de Hotmail/Outlook
pass: 'A159753' // Tu contraseña real
},
tls: {
ciphers: 'SSLv3'
}
});
const contenidoHTML = `
<h2>Recibo de Compra</h2>
<p>Gracias por tu compra. Aquí están los detalles:</p>
<ul>
${libro.map(l => `
<li>${p.titulo} x${p.cantidad} - $${(p.precio *
p.cantidad).toFixed(2)}</li>
`).join('')}
</ul>
<p><strong>Total:</strong> $${venta.total}</p>
`;
await transporter.sendMail({
from: '"Tienda Online" <tu-correo@gmail.com>',
to: destinatario,
subject: 'Tu recibo de compra',
html: contenidoHTML
});
}

