import { Button, LinearProgress, Typography } from "@mui/material";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoinInfo from "../Components/CoinInfo";
import { SingleCoin } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { db } from "../firebase";
import { numberWithCommas } from "../Components/Banner/Cointable";
function CoinPage() {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol, user, portfolio, setalert } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));

    setCoin(data);
  };

  const inportfolio = portfolio.includes(coin?.id);

  const removeFromportfolio = async () => {
    const coinRef = doc(db, "portfolio", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: portfolio.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setalert({
        open: true,
        message: `${coin.name} Removed from the Portfolio !`,
        type: "success",
      });
    } catch (error) {
      setalert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const addtoportfolio = async () => {
    const coinref = doc(db, "portfolio", user.uid);

    try {
      await setDoc(coinref, {
        coins: portfolio ? [...portfolio, coin?.id] : [coin?.id],
      });
      setalert({
        open: true,
        message: `${coin.name} Added to the Portfolio !`,
        type: "success",
      });
    } catch (error) {
      setalert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchCoin();
  }, [currency]);

  if (!coin) return <LinearProgress style={{ backgroundColor: "#361848" }} />;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div // sidebar
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 25,
          borderRight: "2px black",
          width: "30%",
        }}
      >
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography
          variant="h3"
          style={{
            fontWeight: "bold",
            marginBottom: 20,
            fontFamily: "Montserrat",
          }}
        >
          {coin?.name}
        </Typography>

        <div
          style={{
            alignSelf: "start",
            padding: 25,
            paddingTop: 10,
            width: "100%",
          }}
        >
          <span style={{ display: "flex" }}>
            <Typography
              variant="h5"
              style={{
                fontWeight: "bold",
                fontFamily: "Montserrat",
              }}
            >
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {coin?.market_cap_rank}
            </Typography>
            &nbsp; &nbsp;
            <span style={{ display: "flex" }}>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <Typography
                variant="h5"
                style={{
                  fontWeight: "bold",
                  marginBottom: 20,
                  fontFamily: "Montserrat",
                }}
              >
                Current Price:
              </Typography>
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Montserrat",
                }}
              >
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.current_price[currency.toLowerCase()]
                )}{" "}
              </Typography>
            </span>
            &nbsp; &nbsp;
            <span style={{ display: "flex" }}>
              &nbsp; &nbsp;
              <Typography
                variant="h5"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                }}
              >
                24hrs High:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Montserrat",
                }}
              >
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.high_24h[currency.toLowerCase()]
                )}
              </Typography>
            </span>
          </span>
          {user && (
            <Button
              variant="solid"
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inportfolio ? "#ff0000" : "#361848",
                color: "white",
              }}
              onClick={inportfolio ? removeFromportfolio : addtoportfolio}
            >
              {inportfolio ? " Remove To Portfolio" : "Add To Portfolio"}
            </Button>
          )}
        </div>
      </div>
      {/* chart */}
      <CoinInfo coin={coin} />
    </div>
  );
}

export default CoinPage;
