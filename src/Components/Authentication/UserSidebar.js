import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { CryptoState } from "../../CryptoContext";
import { Avatar } from "@mui/material";
import { fontWeight } from "@mui/system";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { AiFillDelete } from "react-icons/ai";
import { numberwithcommas } from "../Banner/Carousel";
import { doc, setDoc } from "firebase/firestore";

export default function UserSidebar() {
  const [state, setState] = React.useState({
    right: false,
  });
  const { user, setalert, portfolio, coins, symbol } = CryptoState();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const logOut = () => {
    signOut(auth);
    setalert({
      open: true,
      type: "success",
      message: "Logout Sucessfull !",
    });
    toggleDrawer();
  };
  const removeFromPortfolio = async (coin) => {
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
  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: "pointer",
              backgroundColor: "#361848",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div
              style={{
                width: 350,
                padding: 25,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                fontFamily: "monospace",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                  height: "92%",
                }}
              >
                <Avatar
                  style={{
                    height: 38,
                    width: 38,
                    marginLeft: 15,
                    cursor: "pointer",
                    backgroundColor: "#361848",
                  }}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <div
                  style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: "#efeae3",
                    borderRadius: 10,
                    padding: 15,
                    paddingTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                    overflowY: "scroll",
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      color: "#361848",
                      fontWeight: "bold",
                    }}
                  >
                    Portfolio
                  </span>

                  {coins.map((coin) => {
                    if (portfolio.includes(coin.id)) {
                      return (
                        <div
                          style={{
                            padding: 10,
                            borderRadius: 5,
                            color: "white",
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#361848",
                          }}
                        >
                          <span>{coin.name}</span>

                          <span style={{ display: "flex", gap: 8 }}>
                            {symbol}{" "}
                            {numberwithcommas(coin.current_price.toFixed(2))}
                            <AiFillDelete
                              style={{ cursor: "pointer", color: "white" }}
                              fontSize="16"
                              onClick={() => removeFromPortfolio(coin)}
                            />
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                style={{
                  height: "8%",
                  width: "100%",
                  backgroundColor: "#361848",
                  marginTop: 20,
                }}
                onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
