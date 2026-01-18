/* eslint-disable prettier/prettier */
"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "@/store/slices/userSlice";
import {
  useGetCartItems,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/queries/useCart";
import { useGetMyInfo } from "@/hooks/queries/useUser";
import { useScrollEffect } from "@/hooks/useScrollEffect";
import { navbarItems } from "@/const/navbarItems";

// Components
import Logo from "./header/Logo";
import NavigationMenu from "./header/NavigationMenu";
import SearchBar from "./header/SearchBar";
import UserDropdown from "./header/UserDropdown";
import CartIcon from "./header/CartIcon";
import Cart from "./cart/Cart";
import LoginRequiredModal from "./ui/LoginRequiredModal";
import NotificationIcon from "./ui/NotificationIcon";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isScrolled = useScrollEffect();

  const dispatch = useDispatch();
  const userInfo = useSelector(selectUser);
  const { getMyInfo } = useGetMyInfo();

  const { getCartItems } = useGetCartItems();
  const { data: cartData } = getCartItems;
  const { mutate: updateCart } = useUpdateCartItem();
  const { mutate: removeCart } = useRemoveCartItem();

  // Fetch user info and update Redux state
  useEffect(() => {
    if (getMyInfo.data) {
      dispatch(
        setUser({
          username: getMyInfo.data.username,
          email: getMyInfo.data.email,
          name: getMyInfo.data.name,
          role: getMyInfo.data.role,
        }),
      );
    }
  }, [dispatch, getMyInfo.data]);

  const handleUpdateItem = (id: number, quantity: number) => {
    updateCart({ cartItemId: id, quantity: Math.max(1, quantity) });
  };

  const handleRemoveItem = (id: number) => {
    removeCart(id);
  };

  const handleCartIconClick = () => {
    if (!userInfo || !userInfo.username) {
      setIsLoginModalOpen(true);
    } else {
      setIsCartOpen(!isCartOpen);
    }
  };

  // Handle cart outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isCartOpen &&
        !target.closest(".cart-container") &&
        !target.closest(".cart-icon")
      ) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen]);

  // Handle body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 shadow-md hover:bg-custom-yellow ${
          isScrolled
            ? "backdrop-blur-md h-[52px] bg-white/30"
            : "bg-custom-yellow h-[72px]"
        }`}
      >
        <nav className="flex justify-between items-center h-full px-5">
          <Logo isScrolled={isScrolled} />
          <NavigationMenu navbarItems={navbarItems} isScrolled={isScrolled} />
          <div className="flex h-full items-center gap-2">
            <SearchBar />
            {userInfo && userInfo.username && <NotificationIcon />}
            <UserDropdown userInfo={userInfo} />
            <CartIcon
              cartData={cartData ?? null}
              onCartClick={handleCartIconClick}
            />
          </div>
        </nav>
      </header>

      {/* Cart Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`cart-container fixed top-0 right-0 h-screen w-[400px] max-w-full transform transition-transform duration-300 ease-in-out ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          } overflow-auto z-[101]`}
        >
          <Cart
            cartItems={cartData?.cartItems ?? []}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onClose={() => setIsCartOpen(false)}
          />
        </div>
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        message="You need to sign in to view your cart"
      />
    </>
  );
};

export default Header;
