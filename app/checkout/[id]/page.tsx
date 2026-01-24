import { auth } from "@/auth"
import OrderDetailsForm from "@/components/shared/order/order-details-form"
import { getOrderById } from "@/lib/actions/order.actions"
import { formatId } from "@/lib/utils"
import Link from "next/link"
import { notFound } from "next/navigation"
import Stripe from 'stripe'
import PaymentForm from "./payment-form"

export default async function  CheckoutPaymentPage (props: {
    params: Promise<{id: string}>
}) {
    const  params = await props.params

    const {id} = params

    const order = await getOrderById(id)
    if(!order) notFound()

    const session = await auth()

    let client_secret = null
if (order.paymentMethod === 'Stripe' && !order.isPaid) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: 'USD',
    metadata: { orderId: order._id.toString() },
  })
  client_secret = paymentIntent.client_secret
}
// client_secret = { client_secret }

    return (
        <>
        <PaymentForm 
            order={order}
            paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
            clientSecret = {client_secret}
            isAdmin={session?.user?.role === 'Admin' || false}
        />
            {/* <div className="flex gap-2">
                <Link href={'/account'}>Your Account</Link>
                <span>{'>'}</span>
                <Link href={'/account/orders'}>Your Orders</Link>
                <span>{'>'}</span>
                <span>Order {formatId(order._id.toString())}</span>
            </div>
            <h1 className="h1-bold py-4">Order {formatId(order._id.toString())}</h1>
            <OrderDetailsForm 
                order={order}
                isAdmin={session?.user.role === 'Admin' || false}
            /> */}
            
        </>
    )


}