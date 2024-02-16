import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CoinList } from "./config/api";
import { db, auth } from "./firebase";

const CryptoContext = createContext();

const CryptoContextProvider = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [portfolio, setportfolio] = useState([]);
  const [user, setUser] = useState(null);
  const [alert, setalert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (user) {
      const coinref = doc(db, "portfolio", user.uid);

      var unsuscribe = onSnapshot(coinref, (coin) => {
        if (coin.exists()) {
          setportfolio(coin.data().coins);
        } else {
          console.log("No Items in Portfolio");
        }
      });
      return () => {
        unsuscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
      //console.log(user);
    });
  }, []);

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
  };
  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  return (
    <CryptoContext.Provider
      value={{
        currency,
        setCurrency,
        symbol,
        coins,
        loading,
        fetchCoins,
        alert,
        setalert,
        user,
        portfolio,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export default CryptoContextProvider;

export const CryptoState = () => {
  return useContext(CryptoContext);
};
