import React, { useRef } from 'react';
import {
  Modal, Box, Typography, Divider, Button, Table, TableHead,
  TableBody, TableRow, TableCell, TableContainer, Paper, Grid,
  Stack
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '210mm', // A4 width
  maxHeight: '90vh',
  bgcolor: '#fff',
  boxShadow: 10,
  borderRadius: 2,
  p: 1.5,
  overflowY: 'auto',
  border: '1px solid black',
  fontFamily: "'Roboto', sans-serif",
};

const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

const SlipModal = ({ open, handleClose, bookingData }) => {
  const printRef = useRef();

  if (!bookingData) return null;

  const addresses = [
    { city: "H.O. DELHI", 
      address: "332, Kucha Ghasi Ram, Chandni Chowk, Fatehpuri, Delhi -110006,", 
      phone: "011-45138699, 7779993453" 
    },

    { city: "MUMBAI", 
      address: "1, Malharrao Wadi, Gr. Flr., R. No. 4, D.A Lane Kalabadevi Rd., Mumbai-400002,", 
      phone: "022-49711975, 7779993454" 
    },
  ];

  const Invoice = () => (
    <Paper elevation={0} sx={{m: 1, border: '1.5px solid black'}}>
      {/* Header */}
      <Grid container justifyContent={'space-between'} p={1}>
        <Grid alignItems={'center'}></Grid>
            <Box  textAlign={'center'} color={'black'}>
                <Typography variant="h5" borderBottom="2px solid #949090ff">
                    BHARAT PARCEL SERVICES PVT.LTD.
                </Typography>

                <Typography display="inline-block" borderBottom="2px solid #949090ff">
                    SUBJECT TO DELHI JURISDICTION
                </Typography>
            </Box> 
    
        <Box textAlign={'end'}>
            <Typography variant="subtitle2" fontWeight="bold">
                GSTIN : 07AAECB6506F1ZY
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold">
                PAN : AAECB6506F
            </Typography>
        </Box>
      </Grid>
                        
      {/* Address Section */}
      <Box sx={{ mt:8, p:1,}}>
        {addresses.map((addr) => (
          <Grid key={addr.city} 
                container spacing={1}
                alignItems='flex-start'
          >
    
            <Typography variant="subtitle2">{addr.city} </Typography>
            <Typography variant='subtitle3' >:</Typography>
            <Typography variant="caption" display='block' fontWeight={'bold'}>{addr.address}</Typography>
            <Typography variant="caption" display='block' fontWeight={'bold'}> {addr.phone}</Typography>
          </Grid>
        ))}
      </Box>

      
      {/* Ref and Date */}
      <Grid container justifyContent={'space-between'} mt={1} borderBottom="1px solid black" p={1} >
        <Typography>Ref. No.: <strong>{bookingData?.items?.[0]?.refNo || '35723'}</strong></Typography>
        <Typography>Date: <strong>{formatDate(bookingData?.bookingDate) || '2-Jun-2025'}</strong></Typography>
      </Grid>

      {/* From & To */}
      <Grid container justifyContent={'space-between'} borderBottom="1px solid black" >
        <Typography>From (City): <strong>{bookingData?.fromCity || 'DELHI'}</strong></Typography>
        <Typography>To (City): <strong>{bookingData?.toCity || 'MUMBAI'}</strong></Typography>
      </Grid>

      <Grid container justifyContent={'space-between'} borderBottom="1px solid black" >
        <Typography>From: <strong>{bookingData?.senderName || 'MITTAL AND SONS'}</strong></Typography>
        <Typography>GSTIN: <strong>{bookingData?.senderGgt || '07AAAFM9652J1ZM'}</strong></Typography>
      </Grid>
          
      <Grid container justifyContent={'space-between'} >
        <Typography>To: <strong>{bookingData?.receiverName || 'JAINEE FAB'}</strong></Typography>
        <Typography>GSTIN: <strong>{bookingData?.receiverGgt || '27AAAPL1508N1ZQ'}</strong></Typography>
      </Grid>
      

      <Table size="small" sx={{ border: '1px solid black' }}>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
                {["No. of.", "Insurance", "VPP Amount", "To Pay/Paid", "Weight (Kgs)", "Amount"].map((head, idx) => (
                    <TableCell key={idx} align="center" sx={{ border: '1px solid black', fontWeight: 'bold' }}>{head}</TableCell>
                ))}
            </TableRow>
        </TableHead>
        <TableBody>
            {bookingData.items.map((item, idx) => (
                <TableRow key={item._id} sx={{ bgcolor: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                    <TableCell sx={{ border: "1px solid black", align:"center" }}>{idx + 1}</TableCell>
                    <TableCell sx={{ border: "1px solid black", align:"center" }}>{formatCurrency(item.insurance)}</TableCell>
                    <TableCell sx={{ border: "1px solid black", align:"center" }}>{formatCurrency(item.vppAmount)}</TableCell>
                    <TableCell sx={{ border: "1px solid black", align:"center" }}>{item.toPay || "To Pay"}</TableCell>
                    <TableCell sx={{ border: "1px solid black", align:"center" }}>{item.weight}</TableCell>

                    <TableCell sx={{ border: "1px solid black", p: 0 }}>
                        <TableRow>
                    <TableCell sx={{ border: "1px solid black", width: "70%" }}>FREIGHT</TableCell>
                    <TableCell sx={{ border: "1px solid black" }} align="right">405.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: "1px solid black" }}>INS/VPP</TableCell>
                    <TableCell sx={{ border: "1px solid black" }} align="right"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: "1px solid black" }}>CGST @ %</TableCell>
                    <TableCell sx={{ border: "1px solid black" }} align="right"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: "1px solid black" }}>SGST @ %</TableCell>
                    <TableCell sx={{ border: "1px solid black" }} align="right"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: "1px solid black" }}>IGST @ 18%</TableCell>
                    <TableCell sx={{ border: "1px solid black" }} align="right">72.90</TableCell>
                  </TableRow>
                    </TableCell>
                    {/* <TableCell sx={{ border: "1px solid black", align:"center", width:"30%" }}>{formatCurrency(item.amount)}</TableCell> */}
                </TableRow>
            ))}

            
            <TableRow>
                <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold', border: '1px solid black' }}>TOTAL</TableCell>
                <TableCell sx={{ border: '1px solid solid', fontWeight: 'bold' }}>{formatCurrency(bookingData?.grandTotal)}</TableCell>
            </TableRow>
        </TableBody>
      </Table>

    </Paper>
  );

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    printWindow.document.write('<html><head><title>Print Invoice</title>');
    printWindow.document.write('<style>@media print { body { margin: 0; } }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printRef.current.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box ref={printRef}>
          {/* Invoice copy 1 */}
          <Invoice />
          {/* Divider Line */}
          <Divider sx={{ borderColor: 'black', borderStyle: 'dashed', my: 1 }} />
          {/* Invoice copy 2 */}
          <Invoice />
        </Box>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            sx={{ borderRadius: 2, px: 4, textTransform: 'none' }}
            onClick={handlePrint}
          >
            Print Invoice
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SlipModal;


