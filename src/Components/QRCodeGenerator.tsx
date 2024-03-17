import React, { useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  data: string;
  size? : number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ data, size = 200 }) => {
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string | null>(null);

  // Function to generate a QR code and set the data URL
  const generateQRCode = async () => {
    try {
      // Generate QR code
      const generatedDataURL = await QRCode.toDataURL(data, {width: size});

      // Set the data URL in the state
      setQRCodeDataURL(generatedDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Call the generateQRCode function when the component mounts
  React.useEffect(() => {
    generateQRCode();
  }, [data]);

  return (
    <div>
      {qrCodeDataURL && <img src={qrCodeDataURL} alt="QR Code" />}
    </div>
  );
};

export default QRCodeGenerator;



//with logo (logo can obstruct the QR Code)
/*
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { createCanvas } from 'canvas';

interface QRCodeGeneratorProps {
  data: string;
  logoSrc: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ data, logoSrc }) => {
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string | null>(null);

  // Function to generate a QR code and set the data URL
  const generateQRCode = async () => {
    try {
      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(data, { width: 200 });

      // Draw QR code on canvas
      const canvas = createCanvas(200, 200);
      const context = canvas.getContext('2d');
      const qrCodeImage = new Image();
      qrCodeImage.src = qrCodeDataURL;

      qrCodeImage.onload = () => {
        context?.drawImage(qrCodeImage, 0, 0, 200, 200);

        // Overlay logo in the center
        const logoSize = 35; // Adjust the size of the logo
        const logoImage = new Image();
        logoImage.src = "./globusLogo.png";

        logoImage.onload = () => {
          const x = (200 - logoSize) / 2;
          const y = (200 - logoSize) / 2;

          context?.drawImage(logoImage, x, y, logoSize, logoSize);

          // Set the final QR code with logo data URL
          setQRCodeDataURL(canvas.toDataURL());
        };
      };
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Call the generateQRCode function when the component mounts
  useEffect(() => {
    generateQRCode();
  }, [data, logoSrc]);

  return (
    <div>
      {qrCodeDataURL && <img src={qrCodeDataURL} alt="QR Code with Logo" />}
    </div>
  );
};

export default QRCodeGenerator;

*/