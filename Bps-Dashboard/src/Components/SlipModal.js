import React, { useRef } from 'react';
import {
  Modal, Box, Typography, Divider, Button, Table, TableHead,
  TableBody, TableRow, TableCell, Paper, Grid
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SlipModal = ({ open, handleClose, bookingData }) => {
  const printRef = useRef();

  if (!bookingData) return null;

  const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

  const addresses = [
    { city: "H.O. DELHI", address: "332, Kucha Ghasi Ram, Chandni Chowk, Fatehpuri, Delhi -110006", phone: "011-45138699, 7779993453" },
    { city: "MUMBAI", address: "1, Malharrao Wadi, Gr. Flr., R. No. 4, D.A Lane Kalbadevi Rd., Mumbai-400002", phone: "022-49711975, 7779993454" }
  ];

  const cgstRate = bookingData?.cgst || 9;
  const sgstRate = bookingData?.sgst || 9;
  const igstRate = bookingData?.igst || 0;

  const cgstAmount = (bookingData?.grandTotal * cgstRate) / 100;
  const sgstAmount = (bookingData?.grandTotal * sgstRate) / 100;
  const igstAmount = (bookingData?.grandTotal * igstRate) / 100;
  const totalWithTax = bookingData?.grandTotal + cgstAmount + sgstAmount + igstAmount;

  const Invoice = () => (
    <Paper elevation={0} sx={{ border: '1px solid black', m: 1, p: 1 }}>
      <Grid container justifyContent="space-between" p={1}>
        <Box textAlign="center" flex={1}>
          <Typography variant="h5" sx={{ borderBottom: '2px solid #999' }}>
            BHARAT PARCEL SERVICES PVT. LTD.
          </Typography>
          <Typography sx={{ borderBottom: '2px solid #999' }}>
            SUBJECT TO {bookingData?.startStation?.stationName} JURISDICTION
          </Typography>
        </Box>
        <Box textAlign="end">
          <Typography variant="subtitle2" fontWeight="bold">GSTIN : {bookingData?.startStation?.gst}</Typography>
          <Typography variant="subtitle2" fontWeight="bold">PAN : AAECB6506F</Typography>
        </Box>
      </Grid>

      <Box sx={{ mt: 1 }}>
        {addresses.map((addr) => (
          <Grid key={addr.city} container alignItems="flex-start">
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{addr.city}:</Typography>
            <Typography variant="caption" ml={0.5} sx={{ fontWeight: 600 }}>{addr.address}</Typography>
            <Typography variant="caption" display="block" sx={{ fontWeight: 600 }}>{addr.phone}</Typography>
          </Grid>
        ))}
      </Box>

      <Grid container justifyContent="space-between" borderTop="1px solid black" borderBottom="1px solid black" p={1}>
        <Typography>Ref. No.: <strong>{bookingData?.items?.[0]?.refNo}</strong></Typography>
        <Typography>Date: <strong>{formatDate(bookingData?.bookingDate)}</strong></Typography>
      </Grid>

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

      <Table size="small" sx={{ border: '1px solid black', mt: 1 }}>
        <TableHead>
          <TableRow>
            {["No.", "Insurance", "VPP Amount", "To Pay/Paid", "Weight (Kgs)", "Amount"].map((h, i) => (
              <TableCell key={i} align="center" sx={{ border: "1px solid black", fontWeight: "bold" }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bookingData.items.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{idx + 1}</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{formatCurrency(item.insurance)}</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{formatCurrency(item.vppAmount)}</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{item.toPay}</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{item.weight}</TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>{formatCurrency(item.amount)}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell colSpan={5} align="right" sx={{ border: "1px solid black", fontWeight: "bold" }}>Sub Total</TableCell>
            <TableCell align="center" sx={{ border: "1px solid black", fontWeight: "bold" }}>{formatCurrency(bookingData?.grandTotal)}</TableCell>
          </TableRow>

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

          <TableRow>
            <TableCell colSpan={5} align="right" sx={{ border: "1px solid black", fontWeight: "bold" }}>Total (Incl. Tax)</TableCell>
            <TableCell align="center" sx={{ border: "1px solid black", fontWeight: "bold" }}>{formatCurrency(totalWithTax)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );

  // ✅ DOWNLOAD AS PDF (A4 FIT)
  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Slip_${bookingData?.bookingId || "BPS"}.pdf`);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', bgcolor: '#fff',
        width: '210mm', p: 2, border: '1px solid black',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <Box ref={printRef}>
          <Invoice />
          <Divider sx={{ borderColor: 'black', borderStyle: 'dashed', my: 2 }} />
          <Invoice />
        </Box>
        <Box textAlign="center" mt={2}>
          <Button variant="contained" startIcon={<ReceiptIcon />} onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SlipModal;
