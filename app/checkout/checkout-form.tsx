"use client"

import useCartStore from "@/hooks/use-cart-store"
import { useRouter } from "next/navigation"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { SubmitHandler, useForm } from "react-hook-form"
import { ShippingAddress } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { ShippingAddressSchema } from "@/lib/validator"
import { useEffect, useState } from "react"
import useIsMounted from "@/hooks/use-is-mounted"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { APP_NAME, AVAILABLE_DELIVERY_DATES, AVAILABLE_PAYMENT_METHODS } from "@/lib/constants"
import Link from "next/link"
import ProductPrice from "@/components/shared/product/product-price"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { calculateFutureDate, formatDateTime, timeUntilMidnight } from "@/lib/utils"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CheckoutFooter from "./checkout-footer"
import { createOrder } from "@/lib/actions/order.actions"
import { toast } from "sonner"


const shippingAddressDefaultValues = process.env.NODE_ENV == "development" ? {
     fullName: 'Basir',
        street: '1911, 65 Sherbrooke Est',
        city: 'Montreal',
        province: 'Quebec',
        phone: '4181234567',
        postalCode: 'H2X 1C4',
        country: 'Canada',
} : {
        fullName: '',
        street: '',
        city: '',
        province: '',
        phone: '',
        postalCode: '',
        country: '',
      }


export default function CheckoutForm(){
    const router = useRouter()
    const isMounted = useIsMounted()

    const {cart:{ items, itemsPrice, taxPrice, shippingPrice,totalPrice, paymentMethod, shippingAddress, deliveryDateIndex} ,
        setShippingAddress,
        setPaymentMethod,
        updateItem,
        addItem,
        removeItem,
        setDeliveryDateIndex,
        clearCart
        } = useCartStore()

    const shippingAddressForm = useForm<ShippingAddress>({
        resolver:  zodResolver(ShippingAddressSchema),
        defaultValues: shippingAddress || shippingAddressDefaultValues
    })

    const onSubmitShippingAddress : SubmitHandler<ShippingAddress> = (values) =>{
      console.log('this is ',values)
        setShippingAddress(values)
        setIsAddressSelected(true)
    } 

    useEffect(()=>{
    if (!isMounted || !shippingAddress) return

    shippingAddressForm.setValue('fullName', shippingAddress.fullName)
    shippingAddressForm.setValue('street', shippingAddress.street)
    shippingAddressForm.setValue('city', shippingAddress.city)
    shippingAddressForm.setValue('country', shippingAddress.country)
    shippingAddressForm.setValue('postalCode', shippingAddress.postalCode)
    shippingAddressForm.setValue('province', shippingAddress.province)
    shippingAddressForm.setValue('phone', shippingAddress.phone)
  }, [items, isMounted, router, shippingAddress, shippingAddressForm])

    const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false)
    const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState<boolean>(false)
    const [isDeliveryDateSelected, setIsDeliveryDateSelected] = useState<boolean>(false)

    const handlePlaceOrder = async () =>{
      const res = await createOrder({
        items,
        shippingAddress,
        expectedDeliveryDate: calculateFutureDate(AVAILABLE_DELIVERY_DATES[deliveryDateIndex!].daysToDeliver),
      deliveryDateIndex,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    })
    if(!res.success){
      // toast('destructive',{
        
      //   description: res.message,
      //   // variant: 'destructive',
      // })
      toast.warning(`${res.message}`)
    } else {
      // toast('default',{
      //   description: res.message
      // })
      toast(`${res.message}`)
      clearCart()
      router.push(`/checkout/${res.data?.orderId}`)
    }

    }

    const handleSelectPaymentMethod = () =>{
        setIsPaymentMethodSelected(true)
        setIsAddressSelected(true)
    }

    const handleSelectShippingAddress = () => {
        shippingAddressForm.handleSubmit(onSubmitShippingAddress)()
    }

    const CheckoutSummary = () => (
        <Card>
            <CardContent className="p-4">
                {!isAddressSelected && (
                    <div className="border-b mb-4">
                        <Button
                            className="rounded-full w-full"
                            onClick={handleSelectShippingAddress}
                        >   
                            Ship to this address
                        </Button>
                        <p className="text-xs text-center py-2">
                            Choose a shipping address and payment method in order to calculate shipping, handling, and tax.
                        </p>
                    </div>
                )}
                {
                    isAddressSelected && !isPaymentMethodSelected && (
                        <div className="mb-4">
                            <Button className="rounded-full w-full" 
                                onClick={handleSelectPaymentMethod}
                            >
                                Use this payment method
                            </Button>
                            <p className="text-xs text-center py-2">
                                Choose a payment method to continue checking out. You&apos;ll still have a chance to review and edit your order before it&apos;s final.
                            </p>
                        </div>
                    )
                }
                {isPaymentMethodSelected && isAddressSelected && (
                    <div>
                        <Button 
                            className="rounded-full w-full"
                            onClick={handlePlaceOrder}
                        >
                            Place Your Order
                        </Button>
                         <p className='text-xs text-center py-2'>
              By placing your order, you agree to {APP_NAME}&apos;s{' '}
              <Link href='/page/privacy-policy'>privacy notice</Link> and
              <Link href='/page/conditions-of-use'> conditions of use</Link>.
            </p>
                    </div>
                )}
                <div>
                    <div className="text-lg font-bold">
                        Order Summary
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Items:</span>
                            <span>
                                <ProductPrice price={itemsPrice} plain/>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping & Handling:</span>
                            <span>
                                {shippingPrice === undefined ? (
                                    '--'
                                ) : shippingPrice === 0 ? (
                                    'Free'
                                ) : (
                                    <ProductPrice price={shippingPrice} plain/>
                                )
                            }
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax: </span>
                            <span>
                                {taxPrice === undefined ? "--" : (
                                    <ProductPrice price={taxPrice} plain/>
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between pt-4 font-bold text-lg">
                            <span> Order Total:</span>
                            <span>
                                <ProductPrice price={totalPrice}/>
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

return (
    <main className='max-w-6xl mx-auto highlight-link'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          {/* shipping address */}
          <div>
            {isAddressSelected && shippingAddress ? (
              <div className='grid grid-cols-1 md:grid-cols-12    my-3  pb-3'>
                <div className='col-span-5 flex text-lg font-bold '>
                  <span className='w-8'>1 </span>
                  <span>Shipping address</span>
                </div>
                <div className='col-span-5 '>
                  <p>
                    {shippingAddress.fullName} <br />
                    {shippingAddress.street} <br />
                    {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                  </p>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsAddressSelected(false)
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(true)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className='flex text-primary text-lg font-bold my-2'>
                  <span className='w-8'>1 </span>
                  <span>Enter shipping address</span>
                </div>
                  <form
                    method='post'
                    onSubmit={shippingAddressForm.handleSubmit(
                      onSubmitShippingAddress
                    )}
                    className='space-y-4'
                  >
                    <Card className='md:ml-8 my-4'>
                      <CardContent className='p-4 space-y-2'>
                        <div className='text-lg font-bold mb-2'>
                          Your address
                        </div>
                            <FieldGroup>

                        <div className='flex flex-col gap-5 md:flex-row'>
                          <Field>
                            <FieldLabel htmlFor="fullName">
                                Full Name
                                </FieldLabel>
                            <Input
                                id="fullName"
                                placeholder="Enter your name"
                                required
                               {...shippingAddressForm.register('fullName')} 
                                />
                          </Field>
                        </div>
                        <div>
                          
                              <Field>
                            <FieldLabel htmlFor="street">
                                Address
                                </FieldLabel>
                            <Input
                                id="street"
                                placeholder="Enter Address"
                                {...shippingAddressForm.register('street')}
                                required
                                />
                          </Field>
                        </div>
                        <div className='flex flex-col gap-5 md:flex-row'>
                          
                              <Field>
                            <FieldLabel htmlFor="city">
                                City
                                </FieldLabel>
                            <Input
                                id="city"
                                placeholder="Enter city"
                                 {...shippingAddressForm.register('city')}
                                required
                                />
                          </Field>
                          
                              <Field>
                            <FieldLabel htmlFor="province">
                                Province
                                </FieldLabel>
                            <Input
                                id="province"
                                placeholder="Enter Province"
                                 {...shippingAddressForm.register('province')}
                                required
                                />
                          </Field>
                              <Field>
                            <FieldLabel htmlFor="country">
                                Country
                                </FieldLabel>
                            <Input
                                id="country"
                                placeholder="Enter country"
                                 {...shippingAddressForm.register('country')}
                                required
                                />
                          </Field>
                        </div>
                        <div className='flex flex-col gap-5 md:flex-row'>
                          
                              <Field>
                            <FieldLabel htmlFor="postalCode">
                                Postal Code
                                </FieldLabel>
                            <Input
                                id="postalCode"
                                placeholder="Enter postal code"
                                 {...shippingAddressForm.register('postalCode')}
                                required
                                />
                          </Field>
                              <Field>
                            <FieldLabel htmlFor="phone">
                                Phone Number
                                </FieldLabel>
                            <Input
                                id="phone"
                                placeholder="Enter phone number"
                                 {...shippingAddressForm.register('phone')}
                                required
                                />
                          </Field>
                        </div>
                        </FieldGroup>
                      </CardContent>
                      <CardFooter className='  p-4'>
                        <Button
                          type='submit'
                          className='rounded-full font-bold'
                        >
                          Ship to this address
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
              </>
            )}
          </div>
          {/* payment method */}
          <div className='border-y'>
            {isPaymentMethodSelected && paymentMethod ? (
              <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                <div className='flex text-lg font-bold  col-span-5'>
                  <span className='w-8'>2 </span>
                  <span>Payment Method</span>
                </div>
                <div className='col-span-5 '>
                  <p>{paymentMethod}</p>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setIsPaymentMethodSelected(false)
                      if (paymentMethod) setIsDeliveryDateSelected(true)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : isAddressSelected ? (
              <>
                <div className='flex text-primary text-lg font-bold my-2'>
                  <span className='w-8'>2 </span>
                  <span>Choose a payment method</span>
                </div>
                <Card className='md:ml-8 my-4'>
                  <CardContent className='p-4'>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value)}
                    >
                      {AVAILABLE_PAYMENT_METHODS.map((pm) => (
                        <div key={pm.name} className='flex items-center py-1 '>
                          <RadioGroupItem
                            value={pm.name}
                            id={`payment-${pm.name}`}
                          />
                          <Label
                            className='font-bold pl-2 cursor-pointer'
                            htmlFor={`payment-${pm.name}`}
                          >
                            {pm.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className='p-4'>
                    <Button
                      onClick={handleSelectPaymentMethod}
                      className='rounded-full font-bold'
                    >
                      Use this payment method
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <div className='flex text-muted-foreground text-lg font-bold my-4 py-3'>
                <span className='w-8'>2 </span>
                <span>Choose a payment method</span>
              </div>
            )}
          </div>
          {/* items and delivery date */}
          <div>
            {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
              <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                <div className='flex text-lg font-bold  col-span-5'>
                  <span className='w-8'>3 </span>
                  <span>Items and shipping</span>
                </div>
                <div className='col-span-5'>
                  <p>
                    Delivery date:{' '}
                    {
                      formatDateTime(
                        calculateFutureDate(
                          AVAILABLE_DELIVERY_DATES[deliveryDateIndex]
                            .daysToDeliver
                        )
                      ).dateOnly
                    }
                  </p>
                  <ul>
                    {items.map((item, _index) => (
                      <li key={_index}>
                        {item.name} x {item.quantity} = {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(false)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : isPaymentMethodSelected && isAddressSelected ? (
              <>
                <div className='flex text-primary  text-lg font-bold my-2'>
                  <span className='w-8'>3 </span>
                  <span>Review items and shipping</span>
                </div>
                <Card className='md:ml-8'>
                  <CardContent className='p-4'>
                    <p className='mb-2'>
                      <span className='text-lg font-bold text-green-700'>
                        Arriving{' '}
                        {
                          formatDateTime(
                            calculateFutureDate(
                              AVAILABLE_DELIVERY_DATES[deliveryDateIndex!]
                                .daysToDeliver
                            )
                          ).dateOnly
                        }
                      </span>{' '}
                      If you order in the next {timeUntilMidnight().hours} hours
                      and {timeUntilMidnight().minutes} minutes.
                    </p>
                    <div className='grid md:grid-cols-2 gap-6'>
                      <div>
                        {items.map((item, _index) => (
                          <div key={_index} className='flex gap-4 py-2'>
                            <div className='relative w-16 h-16'>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes='20vw'
                                style={{
                                  objectFit: 'contain',
                                }}
                              />
                            </div>

                            <div className='flex-1'>
                              <p className='font-semibold'>
                                {item.name}, {item.color}, {item.size}
                              </p>
                              <p className='font-bold'>
                                <ProductPrice price={item.price} plain />
                              </p>

                              <Select
                                value={item.quantity.toString()}
                                onValueChange={(value) => {
                                  if (value === '0') removeItem(item)
                                  else updateItem(item, Number(value))
                                }}
                              >
                                <SelectTrigger className='w-24'>
                                  <SelectValue>
                                    Qty: {item.quantity}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent position='popper'>
                                  {Array.from({
                                    length: item.countInStock,
                                  }).map((_, i) => (
                                    <SelectItem key={i + 1} value={`${i + 1}`}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                  <SelectItem key='delete' value='0'>
                                    Delete
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className=' font-bold'>
                          <p className='mb-2'> Choose a shipping speed:</p>

                          <ul>
                            <RadioGroup
                              value={
                                AVAILABLE_DELIVERY_DATES[deliveryDateIndex!]
                                  .name
                              }
                              onValueChange={(value) =>
                                setDeliveryDateIndex(
                                  AVAILABLE_DELIVERY_DATES.findIndex(
                                    (address) => address.name === value
                                  )!
                                )
                              }
                            >
                              {AVAILABLE_DELIVERY_DATES.map((dd) => (
                                <div key={dd.name} className='flex'>
                                  <RadioGroupItem
                                    value={dd.name}
                                    id={`address-${dd.name}`}
                                  />
                                  <Label
                                    className='pl-2 space-y-2 cursor-pointer'
                                    htmlFor={`address-${dd.name}`}
                                  >
                                    <div className='text-green-700 font-semibold'>
                                      {
                                        formatDateTime(
                                          calculateFutureDate(dd.daysToDeliver)
                                        ).dateOnly
                                      }
                                    </div>
                                    <div>
                                      {(dd.freeShippingMinPrice > 0 &&
                                      itemsPrice >= dd.freeShippingMinPrice
                                        ? 0
                                        : dd.shippingPrice) === 0 ? (
                                        'FREE Shipping'
                                      ) : (
                                        <ProductPrice
                                          price={dd.shippingPrice}
                                          plain
                                        />
                                      )}
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className='flex text-muted-foreground text-lg font-bold my-4 py-3'>
                <span className='w-8'>3 </span>
                <span>Items and shipping</span>
              </div>
            )}
          </div>
          {isPaymentMethodSelected && isAddressSelected && (
            <div className='mt-6'>
              <div className='block md:hidden'>
                <CheckoutSummary />
              </div>

              <Card className='hidden md:block '>
                <CardContent className='p-4 flex flex-col md:flex-row justify-between items-center gap-3'>
                  <Button onClick={handlePlaceOrder} className='rounded-full'>
                    Place Your Order
                  </Button>
                  <div className='flex-1'>
                    <p className='font-bold text-lg'>
                      Order Total: <ProductPrice price={totalPrice} plain />
                    </p>
                    <p className='text-xs'>
                      {' '}
                      By placing your order, you agree to {APP_NAME}&apos;s <Link href='/page/privacy-policy'>
                        privacy notice
                      </Link> and
                      <Link href='/page/conditions-of-use'>
                        {' '}
                        conditions of use
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <CheckoutFooter />
        </div>
        <div className='hidden md:block'>
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}