// import { serve } from '@hono/node-server'
// import { Hono } from 'hono'

// const app = new Hono()

// app.get('/', (c) => {
//   return c.text('Hello Hono!')
// })

// serve({
//   fetch: app.fetch,
//   port: 3000
// }, (info) => {
//   console.log(`Server is running on http://localhost:${info.port}`)
// })

//*-----------------------------------------------------------------
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import Stripe from "stripe";
import "dotenv/config";
import { HTTPException } from "hono/http-exception";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});
// console.log(process.env.STRIPE_SECRET_KEY);
const app = new Hono();

/*
app.get("/", (c) => {
  return c.text("GET it");
});

app.post("/", (c) => {
  return c.text("POST it");
});
*/

// app.get("/", (c) => {
//   const html = `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <title>Checkout</title>
//       <script src="https://js.stripe.com/v3/"></script>
//     </head>
//     <body>
//       <h1>Checkout</h1>
//       <button id="checkoutButton">Checkout</button>

//       <script>
//         const checkoutButton = document.getElementById('checkoutButton');
//         checkoutButton.addEventListener('click', async () => {
//           const response = await fetch('/checkout', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           });
//           const { id } = await response.json();
//           const stripe = Stripe('${process.env.STRIPE_PUBLISHABLE_KEY}');
//           await stripe.redirectToCheckout({ sessionId: id });
//         });
//       </script>
//     </body>
//   </html>
// `;
//   return c.html(html);
// });

app.get("/", (c) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Checkout</title>
      <script src="https://js.stripe.com/v3/"></script>
      <style>
        /* Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #6c63ff, #b993ff);
          color: #333;
        }

        .container {
          background: #fff;
          padding: 2.5rem 3rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
          width: 90%;
          transition: transform 0.3s ease;
        }

        .container:hover {
          transform: translateY(-5px);
        }

        h1 {
          margin-bottom: 1.5rem;
          font-size: 2rem;
          color: #6c63ff;
        }

        button {
          background: #6c63ff;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        button:hover {
          background: #574fd6;
          transform: translateY(-2px);
        }

        button:active {
          transform: translateY(0);
        }

        @media (max-width: 500px) {
          .container {
            padding: 2rem;
          }

          h1 {
            font-size: 1.5rem;
          }

          button {
            width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Checkout</h1>
        <button id="checkoutButton">Pay Now</button>
      </div>

      <script>
        const checkoutButton = document.getElementById('checkoutButton');
        checkoutButton.addEventListener('click', async () => {
          const response = await fetch('/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const { id } = await response.json();
          const stripe = Stripe('${process.env.STRIPE_PUBLISHABLE_KEY}');
          await stripe.redirectToCheckout({ sessionId: id });
        });
      </script>
    </body>
  </html>
  `;
  return c.html(html);
});

app.get("/success", (c) => {
  return c.text("Success!");
});

app.get("/cancel", (c) => {
  return c.text("Hello Hono!");
});

app.post("/checkout", async (c) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          // price: "price_1Sh1hn2cCUKxlBeGR57kaVLu",
          price: "price_1Shlbe2cCUKxlBeG70BSoXMf",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    return c.json(session);
  } catch (error: any) {
    console.error(error);
    throw new HTTPException(500, { message: error?.message });
  }
});

app.post("/webhook", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    throw new HTTPException(400);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(session);

    // TODO Fulfill the purchase with your own business logic, for example:
    // Update Database with order details
    // Add credits to customer account
    // Send confirmation email
    // Print shipping label
    // Trigger order fulfillment workflow
    // Update inventory
    // Etc.
  }

  return c.text("success");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
