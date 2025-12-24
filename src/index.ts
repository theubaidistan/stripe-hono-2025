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
// import { serve } from "@hono/node-server";
import { Hono } from "hono";
import Stripe from "stripe";
import "dotenv/config";
import { HTTPException } from "hono/http-exception";
import fs from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});
// console.log(process.env.STRIPE_SECRET_KEY);

// Base URL (your Vercel domain)
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
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
      <title>Stripe Checkout Backend</title>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png">
      <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png">
      <link rel="apple-touch-icon" href="/apple-touch-icon.png">


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
        <h1>Stripe Checkout</h1>
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

// app.get("/success", (c) => {
//   return c.text("Success!");
// });

app.get("/success", (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Success</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #6EE7B7, #3B82F6);
          color: #fff;
        }
        .card {
          background: rgba(255, 255, 255, 0.1);
          padding: 3rem 5rem;
          border-radius: 1rem;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }
        h1 {
          font-size: 3rem;
          margin: 0 0 1rem 0;
        }
        p {
          font-size: 1.2rem;
          margin: 0;
        }
        a {
          display: inline-block;
          margin-top: 2rem;
          text-decoration: none;
          color: #3B82F6;
          font-weight: bold;
          background: #fff;
          padding: 0.7rem 1.5rem;
          border-radius: 0.5rem;
          transition: 0.3s;
        }
        a:hover {
          background: #e0e7ff;
          color: #1e40af;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Success!</h1>
        <p>Your action was completed successfully.</p>
        <a href="/">Go Back Home</a>
      </div>
    </body>
    </html>
  `;
  return c.html(html);
});

// app.get("/cancel", (c) => {
//   return c.text("Session Cancel");
// });

app.get("/cancel", (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Session Canceled</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #F87171, #B91C1C);
          color: #fff;
        }
        .card {
          background: rgba(255, 255, 255, 0.1);
          padding: 3rem 5rem;
          border-radius: 1rem;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }
        h1 {
          font-size: 3rem;
          margin: 0 0 1rem 0;
        }
        p {
          font-size: 1.2rem;
          margin: 0;
        }
        a {
          display: inline-block;
          margin-top: 2rem;
          text-decoration: none;
          color: #B91C1C;
          font-weight: bold;
          background: #fff;
          padding: 0.7rem 1.5rem;
          border-radius: 0.5rem;
          transition: 0.3s;
        }
        a:hover {
          background: #fee2e2;
          color: #7f1d1d;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Session Canceled</h1>
        <p>Your checkout session was canceled.</p>
        <a href="/">Return Home</a>
      </div>
    </body>
    </html>
  `;
  return c.html(html);
});

app.get("/favicon.ico", (c) => {
  const filePath = path.join(process.cwd(), "public", "favicon.ico");
  const buffer = fs.readFileSync(filePath);
  return c.body(buffer, 200, {
    "Content-Type": "image/x-icon",
  });
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
      success_url: `${BASE_URL}/success`,
      cancel_url: `${BASE_URL}/cancel`,
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

// serve({
//   fetch: app.fetch,
//   port,
// });

// ✅ Export app as default for Vercel serverless
export default app;
