const Stripe = require("stripe");
const { completePayment } = require("./model/DAO/pagamento.js");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const handlePayment = async (event, sig) => {
  event = stripe.webhooks.constructEvent(
    event,
    sig,
    process.env.STRIPE_ENDPOINT_SECRET
  );

  switch (event.type) {
    case "checkout.session.completed":
      const paymentIntentSucceeded = event.data.object;
      return paymentIntentSucceeded;
    default:
      return null
  }
};

const makePayment = async (lote, lance) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: lote.nome,
            images: /*(lote.imagens)*/ ["https://miro.medium.com/v2/resize:fit:1400/1*D0JykQxrL0IpYCZ6LH0CiA.png"],
          },
          unit_amount: Number(lance.preco.toFixed(2)) * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `https://localhost:8080?success=true`,
    cancel_url: `https://localhost:4000?canceled=true`,
  });

  return {url: session.url}
};

module.exports = {
  handlePayment,
  makePayment
};
