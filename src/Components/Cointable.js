import {
  Container,
  LinearProgress,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Typography,
  TableBody,
  Pagination,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { useNavigate } from "react-router-dom";
import { numberwithcommas } from "../Components/Banner/Carousel";

const Cointable = () => {
  const history = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { currency, symbol, coins, loading, fetchCoins } = CryptoState();

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  return (
    <Container style={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        style={{ margin: 18, fontFamily: "Montserrat", color: "#361848" }}
      >
        Cryptocurrency Prices by Market Cap
      </Typography>
      <TextField
        label="Search For a Crypto Currency.."
        variant="outlined"
        style={{ marginBottom: 20, width: "100%" }}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableContainer>
        {loading ? (
          <LinearProgress style={{ backgroundColor: "#361848" }} />
        ) : (
          <Table>
            <TableHead style={{ backgroundColor: "#361848" }}>
              <TableRow>
                {[
                  "Coin",
                  "Price",
                  "24h Change",
                  "Market Cap",
                  "Market Cap Rank",
                ].map((head) => (
                  <TableCell
                    style={{
                      backgroundColor: "#361848",
                      color: "white",
                      fontWeight: "700",
                      fontFamily: "Montserrat",
                    }}
                    key={head}
                    align={head === "Coin" ? "" : "right"}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {handleSearch()
                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                .map((row) => {
                  const profit = row.price_change_percentage_24h > 0;
                  return (
                    <TableRow
                      onClick={() => history(`/coins/${row.id}`)}
                      style={{
                        backgroundColor: "white",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#131111",
                        },
                        fontFamily: "Montserrat",
                      }}
                      key={row.name}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                          display: "flex",
                          gap: 15,
                        }}
                      >
                        <img
                          src={row?.image}
                          alt={row.name}
                          height="50"
                          style={{ marginBottom: 10 }}
                        />
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            style={{
                              textTransform: "uppercase",
                              fontSize: 22,
                              color: "#361848",
                            }}
                          >
                            {row.symbol}
                          </span>
                          <span style={{ color: "#361848" }}>{row.name}</span>
                        </div>
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{ color: "#361848", fontWeight: "bold" }}
                      >
                        {symbol}{" "}
                        {numberwithcommas(row.current_price.toFixed(2))}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {profit && "+"}
                        {row.price_change_percentage_24h.toFixed(2)}%
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{ color: "#361848", fontWeight: "bold" }}
                      >
                        {symbol}{" "}
                        {numberwithcommas(
                          row.market_cap.toString().slice(0, -6)
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ color: "#361848", fontWeight: "bold" }}
                      >
                        {row.market_cap_rank.toString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <Pagination
        style={{
          padding: 20,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        color="secondary"
        count={(handleSearch()?.length / 10).toFixed(0)}
        onChange={(_, value) => {
          setPage(value);
          window.scroll(0, 450);
        }}
      />
    </Container>
  );
};

export default Cointable;
