const Stripe = require("stripe");

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

const makePayment = async (user, data) => {

  let usuario = user[0].usuario[0].id

  try {
    
    const customer = await stripe.customers.create({
      metadata:{
        userId: String(usuario)
      }
    })
  
    const session = await stripe.checkout.sessions.create({
  
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: data[0].nome,
              images: [data.imagens[0].url, data.imagens[1].url, data.imagens[2].url],
            },
            unit_amount: Number(user[0].valor.toFixed(2)) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      customer: customer.userId,
      success_url: `https://localhost:8080?success=true`,
      cancel_url: `https://localhost:4000?canceled=true`,
    });
    
    return {url: session.url}
    
  } catch (error) {
    return error
  }
 
};

module.exports = {
  handlePayment,
  makePayment
};
