'use client'
import { useState, useEffect } from 'react';
import React from 'react';
import Image from 'next/image';
import { Box, Modal, Typography, Stack, TextField, Button, AppBar, Fab } from '@mui/material';
import { firestore } from '../firebase';
import { collection, query, setDoc, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [openHomeModal, setOpenHomeModal] = useState(true);
  const [openAddItemsModal, setOpenAddItemsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [item, setItemName] = useState('');

  const handleOpenHomeModal = () => setOpenHomeModal(true);
  const handleCloseHomeModal = () => setOpenHomeModal(false);

  const handleOpenAddItemsModal = () => setOpenAddItemsModal(true);
  const handleCloseAddItemsModal = () => setOpenAddItemsModal(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.charAt(0).toUpperCase() + item.slice(1).toLowerCase());
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box width="100vw" height="100vh" 
      display="flex"
      flexDirection={"column"}
      justifyContent="space-between"
      alignItems="start"
      gap={2} className="bg-black">
      <AppBar position="sticky"  className='bg-transparent border-b border-white border-opacity-25 flex content-evenly justify-items-center flex-row place-content-evenly py-3'> 
        <Image src="/favicon.ico" width={80} height={80} alt="logo Smarty Pantry"/> 
        <Typography className='text-2xl font-bold text-center items-center flex'> Smarty Pantry </Typography>
        <Box className="flex justify-center items-center gap-4">
        <Button variant="contained" onClick={handleOpenHomeModal} className='bg-gradient-to-tr from-rose-300 to-emerald-700'>🏡</Button>
        <Button className="text-pink-300 font-bold text-base px-3 ">Get Recipes ✨</Button>
        </Box>
      </AppBar>
      <Box width="100vw" height="100vh" display="flex" flexDirection={"column"} justifyContent="start" alignItems="center" gap={2} top={0}>
        <Modal open={openHomeModal} onClose={handleCloseHomeModal}>
          <Box position={'absolute'} top={"50%"} left={"50%"} border={"2px solid #eee"} boxShadow={24} p={4} display={"flex"} flexDirection={'column'} gap={3} sx={{  transform: 'translate(-50%, -50%)', }} className=" bg-gradient-to-br from-pink-200 to-purple-900 w-svw md:w-5/6 lg:w-5/12">
            <Typography variant='h5' className="text-center font-bold text-fuchsia-950">WELCOME TO SMARTY PANTRY!</Typography>
            <Typography className="flex-wrap text-center text-white">Hello There! I am MissAI, the Creator of SmartyPantry. Smarty Pantry comes with an immersive blend of AI, UI, Frontend and Backend, all with the support of Next.js, React, Firebase, Material UI, Tailwind CSS, Daisy UI, Open AI API, & Llama 3.1 API</Typography>
            <Typography className="flex-wrap text-center text-white">Play around and do whatever, the park is yours!</Typography>
            <Button variant='contained' onClick={handleCloseHomeModal} className="glass bg-black font-bold hover:bg-pink-500">Close</Button>
          </Box>
        </Modal>
        <Modal open={openAddItemsModal} onClose={handleCloseAddItemsModal}>
          <Box position={'absolute'} top={"50%"} left={"50%"} border={"2px solid #eee"} boxShadow={24} p={4} display={"flex"} flexDirection={'column'} gap={3} sx={{  transform: 'translate(-50%, -50%)', }} className=" bg-gradient-to-br from-pink-200 to-purple-900 w-svw md:w-5/6 lg:w-4/12">
            <Typography variant='h5' className="text-center font-bold text-fuchsia-950">Add New Items</Typography>
            <Box className="flex flex-row gap-2">
              <TextField variant="outlined" placeholder="Item Name" value={item} onChange={(e) => setItemName(e.target.value)} className="bg-white rounded w-full"/>
              <Button variant='contained' className="bg-gradient-to-br from-teal-200 to-pink-700 text-black hover:bg-gradient-to-tr font-bold" onClick={() => {addItem(item), setItemName(''), handleCloseAddItemsModal()}}>Add</Button>
            </Box>
            <Button variant='contained' onClick={handleCloseAddItemsModal} className=" bg-black font-bold hover:bg-pink-500">Close</Button>
          </Box>
        </Modal>
        
        <Fab variant="extended" onClick={handleOpenAddItemsModal} className="absolute font-bold text-3xl bottom-14 right-14 bg-pink-700 shadow-red-500/50 shadow-md text-white hover:text-pink-700">+</Fab>
          <TextField 
            variant="outlined" 
            placeholder="Search Inventory" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-5/6 md:w-1/2 lg:w-1/3 my-4 bg-white rounded"
          />
          <Box border="1px solid #eee" className="w-svw md:w-6/12 lg:w-8/12 rounded">
            <Box height={"50px"} display={"flex"} alignItems={"center"} justifyContent={"center"} className="bg-rose-400">
              <Typography variant='h4' color={'#fff'} className="font-serif italic text-lg md:text-xl lg:text-3xl">Inventory Items</Typography>
            </Box>
            <Stack height={"400px"} spacing={1} overflow={"auto"}>
              {filteredInventory.map(({ name, quantity }) => (
                <Box 
                  key={name} 
                  width={"100%"} 
                  minHeight={"70px"}
                  className="px-3 bg-pink-200 hover:bg-white flex items-center justify-between flex-row">
                  <Typography variant='h5' color={"#333"} textAlign={"center"} className='px-3 font-bold text-sm md:text-md lg:text-lg'>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant='h5' color={"#333"} textAlign={"center"} className='font-bold text-sm md:text-md lg:text-lg'>
                    {quantity}
                  </Typography>
                  <Box className="flex items-center justify-center flex-row gap-2 px-3">
                    <Button variant='contained' className="bg-rose-950 hover:bg-rose-700 font-bold rounded-full" onClick={() => addItem(name)}>+</Button>
                    <Button variant='contained' className="bg-rose-950 hover:bg-rose-700 font-bold rounded-full" onClick={() => removeItem(name)}>-</Button>
                  </Box>
                </Box>
              ))}
            </Stack>
        </Box>
      </Box>
    </Box>
  );
}
