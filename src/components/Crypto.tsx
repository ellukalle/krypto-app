'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Box, styled, Button, alpha } from "@mui/material";
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import{ PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();


interface CryptoData {
  priceUsd: number;
  id: string;
  changePercent24Hr: number;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


export default function Home({data2}:any) {
  const [contacts, setContacts] = useState()
  const [data, setData] = useState<CryptoData[] | null>(data2);
  const [expand, setExpand] = useState<string | null>(null);
  const [buyCrypto, setBuyCrypto] = useState({ price: 0, id: '' });
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`https://api.coincap.io/v2/assets`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => setData(data.data))
        .catch(err => console.error(err));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const determineColor = (percent: number) => {
    return percent > 0 ? 'green' : 'red';
  };

  const StyledBox = styled(Box)(({ theme }) => ({
    width: "67vw",
    height: "25vh",
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: theme.spacing(2),
    columnGap: theme.spacing(5),
    "&>*": { flex: "0 1 auto" },
    "&:nth-child(even)": { flex: "1 1 200px", backgroundColor: "white" }
  }));

  const handleBuy = async (priceUsd: number, id: string) => {
    setBuyCrypto({ price: priceUsd, id: id });
    console.log(`Crypto bought at price: $${priceUsd}, ID: ${id}`);
    
    try {
      await prisma.contact.create({
        data: {
          id: id,
          cryptoId: id,
          cryptoPriceUsd: priceUsd
        }
      });
      console.log("Data inserted successfully!");
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };
  
  return (
    <div>
      <Button
        sx={{display: 'flex', position: 'fixed'}}
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        sell
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {data2.map((e: { cryptoId: string ,cryptoPriceUsd: number }) => (
          <MenuItem key={e.cryptoId} onClick={handleClose} disableRipple>
            <Typography sx={{
              display: 'flex', 
              color: "black", 
              textAlign: 'center',
              ml: 'auto'}}>
                {e.cryptoId}
            </Typography>
            <Typography sx={{
              display: 'flex', 
              color: "black", 
              textAlign: 'center',
              ml: '20px'}}>
                {e.cryptoPriceUsd}
            </Typography>
            <Button variant="outlined" sx={{display: 'flex', ml: '25px'}} >Sell</Button>
          </MenuItem>
        ))}
      </StyledMenu>
      <Box sx={{display: 'flex', ml: "auto",mr: "auto", justifyContent: "center"}}  ><img
        src="/NordiCrypt.png"
        style={{display: 'flex', marginTop: '10px', maxWidth: "100%"}}
      /></Box>

      <Box id="currencies" sx={{display: "flex", flexDirection: "column", height: "500px"}}>
        {data ? data.map(crypto => (
          <StyledBox key={crypto.id} >
            <Typography key={crypto.id} sx={{display: 'flex', color: "brown", fontSize: "1.5rem", textAlign: 'center'}}>
              {crypto.id}
            </Typography>
            <Typography key={crypto.priceUsd} sx={{
              display: 'flex', 
              color: "brown", 
              fontSize: "1.5rem", 
              textAlign: 'center',
              ml: 'auto'}}>
                ${Number(crypto.priceUsd).toFixed(2)}
            </Typography>
            <Typography key={crypto.changePercent24Hr} sx={{
              display: 'flex', 
              color: determineColor(Number(crypto.changePercent24Hr)), 
              fontSize: "1.5rem", 
              textAlign: 'center'}}>
                {Number(crypto.changePercent24Hr).toFixed(2)}%
            </Typography>
            <Button variant="contained" onClick={() => handleBuy(crypto.priceUsd, crypto.id)} >Buy</Button>
          </StyledBox>
        )) : "Loading..."}
      </Box>
    </div>
  );
}
