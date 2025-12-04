import { OrderItem } from "@/types";
import { round2 } from "../utils";
import { FREE_SHIPPIN_MIN_PRICE } from "../constants";

export const calcDeliveryDateAndPrice = ({
  items,
}: {
  items: OrderItem[];
  deliveryDateIndex?: number;
}) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  const shippingPrice = itemsPrice > FREE_SHIPPIN_MIN_PRICE ? 0 : 5;
  const taxPrice = round2(itemsPrice * 0.15);

  const totalPrice = round2(
    itemsPrice + shippingPrice
      ? round2(shippingPrice)
      : 0 + taxPrice
        ? round2(taxPrice)
        : 0
  );

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};
