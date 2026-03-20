import { create } from 'zustand';

export const useStore = create((set, get) => ({
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  wishlist: localStorage.getItem('wishlist')
    ? JSON.parse(localStorage.getItem('wishlist'))
    : [],
  setWishlist: (data) => {
    localStorage.setItem('wishlist', JSON.stringify(data));
    set({ wishlist: data });
  },
  theme: localStorage.getItem('theme') || 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    return { theme: newTheme };
  }),
  language: localStorage.getItem('language') || 'en',
  setLanguage: (lang) => set(() => {
    localStorage.setItem('language', lang);
    return { language: lang };
  }),
  login: (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    set({ userInfo: data });
  },
  logout: () => {
    localStorage.removeItem('userInfo');
    set({ userInfo: null, cartItems: [], shippingAddress: {}, wishlist: [] });
  },
  addToCart: (item) => {
    const cartId = `${item._id}-${item.spiceLevel || 'Standard'}-${item.packagingSize || 'Standard'}-${item.subscription || 'One-time'}`;
    const cartItem = { ...item, cartId };
    const existItem = get().cartItems.find((x) => x.cartId === cartId || (!x.cartId && x._id === item._id));

    let newCartItems;
    if (existItem) {
      newCartItems = get().cartItems.map((x) =>
        (x.cartId === existItem.cartId || x._id === existItem._id) ? cartItem : x
      );
    } else {
      newCartItems = [...get().cartItems, cartItem];
    }
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    set({ cartItems: newCartItems });
  },
  removeFromCart: (cartIdOrId) => {
    const newCartItems = get().cartItems.filter((x) => x.cartId !== cartIdOrId && x._id !== cartIdOrId);
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    set({ cartItems: newCartItems });
  },
  saveShippingAddress: (data) => {
    localStorage.setItem('shippingAddress', JSON.stringify(data));
    set({ shippingAddress: data });
  },
  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({ cartItems: [] });
  },
}));
