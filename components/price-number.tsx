"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

export default function PriceNumber({ price }: { price: number }) {
  const [priceShown, setPriceShown] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setPriceShown(price), 650);
    return () => clearTimeout(id);
  }, [price]);

  return (
    <NumberFlow
      value={Number(priceShown.toFixed(2))}
      format={{ style: "currency", currency: "USD" }}
      locales="en-US"
    />
  );
}