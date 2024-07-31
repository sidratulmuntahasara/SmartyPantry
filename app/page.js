'use client'
import { useState, useEffect } from 'react'
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import { firestore } from '@/firebase'
import { collection, query, setDoc, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore'

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

  return <Box width="100vw" height="100vh" 
    display="flex"
    flexDirection={"column"}
    justifyContent="center"
    alignItems="center"
    gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box
        position={'absolute'}
        top={"50%"}
        left={"50%"}
        width={400}
        bgcolor={"white"}
        border={"2px solid #eee"}
        boxShadow={24}
        p={4}
        display={"flex"}
        flexDirection={'column'}
        gap={3}
        sx={{
          transform: 'translate(-50%, -50%)',
        }}
        >
          <Typography variant='h6'>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
            variant='outlined' 
            fullWidth 
            value={item} 
            onChange={(e) => {
              setItemName(e.target.value)
            } } />
            <Button
            variant='outlined'
            onClick={() => {addItem(item)
              setItemName('')
              handleClose()
            }}
            >
              ADD
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant='contained' onClick={() => {handleOpen()}}>Add New Item</Button>
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
}
