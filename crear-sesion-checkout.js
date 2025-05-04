import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51RKwwDHs8qWHtqinKWEz3NIPTKaJDrcizxKqOpQXCcj6mM27dkd66qYBY7bLNhhL81J28oPMrR1fI6vXm9E9YskE00VdIJceJM');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Método no permitido');
  }

  const { carrito } = req.body;

  try {
    const line_items = carrito.map(item => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.nombre,
        },
        unit_amount: item.precio * 100,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'apple_pay'],
      mode: 'payment',
      line_items,
      success_url: 'https://marqz.vercel.app/success',
      cancel_url: 'https://marqz.vercel.app/cancel',
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear sesión de pago' });
  }
}
