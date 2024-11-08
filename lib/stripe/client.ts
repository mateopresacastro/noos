import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "@/cfg";
import "server-only";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export default stripe;
