// ProductCard.tsx ya ProductDetail.tsx mein top par:
import { useCart } from "@/context/CartContext";

// Component ke andar:
const { addToCart } = useCart();

// Button par:
<button onClick={() => addToCart(product)}>
  Add to Cart
</button>