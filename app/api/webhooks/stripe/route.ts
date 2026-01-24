import Order from "@/db/models/order.model";
import { sendPurchaseReceipt } from "@/emails";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string,
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const orderId = charge.metadata.orderId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    const order = await Order.findById(orderId).populate("user", "email");

    if (order == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: event.id,
      status: "COMPLETED",
      email_address: email!,
      pricePaid: (pricePaidInCents / 100).toFixed(2),
    };

    await order.save();

    try {
      await sendPurchaseReceipt({ order });
    } catch (error) {
      console.error("email error", error);
    }

    return NextResponse.json({
      message: "updateOrderToPaid was successful",
    });
  }
  return new NextResponse();
}
