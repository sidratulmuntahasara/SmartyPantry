'use client'
import "./globals.css";
import { useState, useEffect } from 'react'
import React from 'react'
import Image from 'next/image'
import { Box, Modal, Typography, Stack, TextField, Button, AppBar, Fab } from '@mui/material'
import { firestore } from '../firebase'
import { collection, query, setDoc, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore'
// import { ResponsiveAppBar } from "./appbar";


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(true)
  const [item, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs (snapshot)
    const inventoryList = []
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
  
    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1
        })
      }
    }

    await updateInventory()

  }


  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.charAt(0).toUpperCase()+item.slice(1).toLowerCase())
    const docSnap = await getDoc(docRef)
  
    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
        await setDoc(docRef, {quantity: quantity + 1})
      }
    else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()

  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  return <Box width="100vw" height="100vh" 
    display="flex"
    flexDirection={"column"}
    justifyContent="space-between"
    alignItems="start"
    gap={2} className="bg-black">
      <AppBar position="sticky"  className='bg-transparent border-b border-white border-opacity-25 flex content-evenly justify-items-center flex-row place-content-evenly py-3'> 
      <Image src="/favicon.ico" width={80} height={80} alt="logo Smarty Pantry"/> 
      <Typography className='text-3xl text-center items-center flex text-pink-200'> <Typography className='text-3xl text-pink-500 text-center items-center flex'>S</Typography>marty&nbsp; <Typography className='text-3xl text-pink-500 text-center items-center flex'>P</Typography>antry </Typography>
      <Button className="text-pink-300 font-bold text-base px-3 ">Get Recipes ✨</Button>
      </AppBar>
      {/* <ResponsiveAppBar/> */}
      <Box width="100vw" height="100vh" display="flex" flexDirection={"column"} justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position={'absolute'} top={"50%"} left={"50%"} border={"2px solid #eee"} width={650} boxShadow={24} p={4} display={"flex"} flexDirection={'column'} gap={3} sx={{  transform: 'translate(-50%, -50%)', }} className=" bg-gradient-to-br from-pink-200 to-purple-900">
          <Typography variant='h5' className="text-center font-bold text-fuchsia-950">WELCOME TO SMARTY PANTRY!</Typography>
          <Typography className="flex-wrap text-center text-white">Hello There! I am MissAI, the Creator of SmartyPantry. Smarty Pantry comes with an immersive blend of AI, UI, Frontend and Backend, all with the support of Next.js, React, Firebase, Material UI, Tailwind CSS, Daisy UI, Open AI API, & Llama 3.1 API</Typography>
          <Typography className="flex-wrap text-center text-white">Play around and do whatever, the park is yours!</Typography>
          <Button variant='contained' onClick={handleClose} className="bg-black hover:bg-pink-500">Close</Button>
        </Box>
      </Modal>
      <Fab variant="extended" onClick={() => {handleOpen()}} className="absolute font-bold bottom-14 right-14 bg-pink-700 shadow-red-500/50 shadow-md text-white hover:text-pink-700">Add New Item</Fab>
      <Box border="1px solid #eee">
        <Box width={"800px"} height={"100px"} bgcolor={"#ADD8E6"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Typography variant='h2' color={'#333'} >Inventory Items</Typography>
        </Box>
      <Stack width={"800px"} height={"300px"} spacing={2} overflow={"auto"}>
            {
              inventory.map(({name, quantity}) => (
                <Box 
                key={name} 
                width={"100%"} 
                minHeight={"150px"} 
                display={"flex"} 
                alignItems={"center"} 
                justifyContent={"space-between"} 
                flexDirection={"row"} 
                bgcolor={"#f0f0f0"} 
                padding={5}>
                  <Typography variant='h3' color={"#333"} textAlign={"center"}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant='h3' color={"#333"} textAlign={"center"}>
                    {quantity}
                  </Typography>
                  <Box display={"flex"} 
                alignItems={"center"} 
                justifyContent={"space-between"} 
                flexDirection={"row"} gap={2}>
                    <Button variant='contained' onClick={() => {
                      addItem(name)
                    }}>Add</Button>
                    <Button variant='contained' onClick={() => {
                      removeItem(name)
                    }}>Remove</Button>
                  </Box>
                </Box>
              ))
            }
      </Stack>
      </Box>
      </Box>
  </Box>
}
