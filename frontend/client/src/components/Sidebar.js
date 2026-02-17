import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const Sidebar = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("/api/balance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBalance(res.data.balance);
      } catch (err) {
        console.error("Balance fetch failed");
      }
    };

    fetchBalance();
  }, []);

  return (
    <Drawer variant="permanent" anchor="left">
      <Box sx={{ width: 250, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Bank Management
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* 💰 Balance Section */}
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: 2,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Typography variant="body2">Current Balance</Typography>
          <Typography variant="h6">₹ {balance}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button component={Link} to="/transactions">
            <ListItemText primary="Transactions" />
          </ListItem>

          <ListItem button component={Link} to="/settings">
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;