import React, { useRef } from 'react';
import {
  Modal, Box, Typography, Divider, Button, Table, TableHead,
  TableBody, TableRow, TableCell, Paper, Grid
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

const SlipModal = ({ open, handleClose, bookingData }) => {
  const printRef = useRef();

  if (!bookingData) return null;

  // --- helper functions ---
  const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

  // --- local addresses ---
  const addresses = [
    { city: "H.O. DELHI", address: "332, Kucha Ghasi Ram, Chandni Chowk, Fatehpuri, Delhi -110006", phone: "011-45138699, 7779993453" },
    { city: "MUMBAI", address: "1, Malharrao Wadi, Gr. Flr., R. No. 4, D.A Lane Kalbadevi Rd., Mumbai-400002", phone: "022-49711975, 7779993454" }
  ];

  // --- tax calculations (fallback if not provided from API) ---
  const cgstRate = bookingData?.cgst || 9;
  const sgstRate = bookingData?.sgst || 9;
  const igstRate = bookingData?.igst || 0;

  const cgstAmount = (bookingData?.grandTotal * cgstRate) / 100;
  const sgstAmount = (bookingData?.grandTotal * sgstRate) / 100;
  const igstAmount = (bookingData?.grandTotal * igstRate) / 100;
  const totalWithTax = bookingData?.grandTotal + cgstAmount + sgstAmount + igstAmount;

  // --- invoice layout ---
  const Invoice = () => (
    <Paper elevation={0} sx={{ m: 1, border: '1.5px solid black' }}>
      {/* Header */}
      <Grid container justifyContent="space-between" p={1}>
        <Box textAlign="center" color="black">
          <Typography variant="h5" borderBottom="2px solid #949090ff">
            BHARAT PARCEL SERVICES PVT.LTD.
          </Typography>
          <Typography display="inline-block" borderBottom="2px solid #949090ff">
            SUBJECT TO {bookingData?.startStation?.stationName} JURISDICTION
          </Typography>
        </Box>

        <Box textAlign="end">
          <Typography variant="subtitle2" fontWeight="bold">GSTIN : {bookingData?.startStation?.gst}</Typography>
          <Typography variant="subtitle2" fontWeight="bold">PAN : AAECB6506F</Typography>
        </Box>
      </Grid>

      {/* Address Section */}
      <Box sx={{ mt: 2, p: 1 }}>
        {addresses.map((addr) => (
          <Grid key={addr.city} container alignItems="flex-start" spacing={0.5}>
            <Typography variant="subtitle2">{addr.city}</Typography>
            <Typography variant="subtitle2" mx={0.5}>:</Typography>
            <Typography variant="caption" fontWeight="bold">{addr.address}</Typography>
            <Typography variant="caption" display="block" fontWeight="bold">{addr.phone}</Typography>
          </Grid>
        ))}
      </Box>

      {/* Ref & Dates */}
      <Grid container justifyContent="space-between" borderTop="1px solid black" borderBottom="1px solid black" p={1}>
        <Typography>Ref. No.: <strong>{bookingData?.items?.[0]?.refNo}</strong></Typography>
        <Typography>Date: <strong>{formatDate(bookingData?.bookingDate)}</strong></Typography>
      </Grid>

      {/* From & To */}
      <Grid container justifyContent="space-between" borderBottom="1px solid black" p={1}>
        <Typography>From (City): <strong>{bookingData?.fromCity}</strong></Typography>
        <Typography>To (City): <strong>{bookingData?.toCity}</strong></Typography>
      </Grid>

      <Grid container justifyContent="space-between" borderBottom="1px solid black" p={1}>
        <Typography>From: <strong>{bookingData?.senderName}</strong></Typography>
        <Typography>GSTIN: <strong>{bookingData?.senderGgt}</strong></Typography>
      </Grid>

      <Grid container justifyContent="space-between" borderBottom="1px solid black" p={1}>
        <Typography>To: <strong>{bookingData?.receiverName}</strong></Typography>
        <Typography>GSTIN: <strong>{bookingData?.receiverGgt}</strong></Typography>
      </Grid>

      {/* Items Table */}
      <Table size="small" sx={{ border: '1px solid black', mt: 1 }}>
        <TableHead>
          <TableRow>
            {["No. of", "Insurance", "VPP Amount", "To Pay/Paid", "Weight (Kgs)", "Amount"].map((h, i) => (
              <TableCell key={i} align="center" sx={{ border: "1px solid black", fontWeight: "bold" }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bookingData.items.map((item, idx) => (
            <TableRow key={item._id || idx}>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{idx + 1}</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{formatCurrency(item.insurance)}</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{formatCurrency(item.vppAmount)}</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{item.toPay}</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{item.weight}</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{formatCurrency(item.amount)}</TableCell>
            </TableRow>
          ))}

          {/* Totals */}
          <TableRow>
            <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Sub Total</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>
              {formatCurrency(bookingData?.grandTotal)}
            </TableCell>
          </TableRow>

          {/* Tax rows */}
          {cgstRate > 0 && (
            <TableRow>
              <TableCell colSpan={5} align="right" sx={{ border: "1px solid black" }}>CGST ({cgstRate}%)</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{formatCurrency(cgstAmount)}</TableCell>
            </TableRow>
          )}
          {sgstRate > 0 && (
            <TableRow>
              <TableCell colSpan={5} align="right" sx={{ border: "1px solid black" }}>SGST ({sgstRate}%)</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{formatCurrency(sgstAmount)}</TableCell>
            </TableRow>
          )}
          {igstRate > 0 && (
            <TableRow>
              <TableCell colSpan={5} align="right" sx={{ border: "1px solid black" }}>IGST ({igstRate}%)</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{formatCurrency(igstAmount)}</TableCell>
            </TableRow>
          )}

          {/* Total after tax */}
          <TableRow>
            <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Total (Incl. Tax)</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>
              {formatCurrency(totalWithTax)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );

  const handlePrint = () => {
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Invoice</title></head><body>${printRef.current.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', bgcolor: '#fff', width: '210mm',
        border: '1px solid black', p: 2, maxHeight: '90vh', overflowY: 'auto'
      }}>
        <Box ref={printRef}>
          <Invoice />
          <Divider sx={{ borderColor: 'black', borderStyle: 'dashed', my: 1 }} />
          <Invoice />
        </Box>
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            sx={{ borderRadius: 2, px: 4, textTransform: 'none' }}
            onClick={handlePrint}
          >
            Print Slip
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SlipModal;
