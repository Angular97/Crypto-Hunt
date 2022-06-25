import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import Authmodel from "./Authentication/Authmodel";
import UserSidebar from "./Authentication/UserSidebar";

const Header = () => {
  const history = useNavigate();
  const { currency, setCurrency, user } = CryptoState();

  return (
    <AppBar color="transparent" position="static">
      <Container>
        <Toolbar>
          <Typography
            variant="h5"
            onClick={() => history("/")}
            style={{
              flex: 1,
              color: "#361848",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Crypto Hunt
          </Typography>
          <Select
            variant="outlined"
            style={{ width: 100, height: 40, marginLeft: 15 }}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value={"USD"}>USD</MenuItem>
            <MenuItem value={"INR"}>INR</MenuItem>
          </Select>
          {user ? <UserSidebar /> : <Authmodel />}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
