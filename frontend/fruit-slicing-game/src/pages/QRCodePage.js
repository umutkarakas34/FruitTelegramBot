import React from 'react';

const QRCodePage = () => {
  const qrCodeImageUrl = process.env.PUBLIC_URL + '/images/qr-code.png'; // Resminizin doğru yolu

  return (
    <div className="qr-code-container">
      <img src={qrCodeImageUrl} alt="QR Kod" className="qr-code-image" />
    </div>
  );
};

export default QRCodePage;
