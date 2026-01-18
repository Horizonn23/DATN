interface GenerateVietQRParams {
  amount: number;
  orderId: number;
}

export const generateVietQR = async ({
  amount,
  orderId,
}: GenerateVietQRParams) => {
  try {
    const response = await fetch("https://api.vietqr.io/v2/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountNo: "106875363958",
        accountName: "NGUYEN KIEU LINH", // Viết in hoa không dấu
        acqId: "970415", // VietinBank
        amount: amount, // Số tiền từ order
        addInfo: `Thanh toan don hang #${orderId}`, // Nội dung chuyển khoản
        template: "compact",
      }),
    });

    const result = await response.json();
    if (result.code === "00") {
      return {
        success: true,
        qrDataURL: result.data.qrDataURL,
        qrCode: result.data.qrCode,
      };
    } else {
      return {
        success: false,
        error: result.desc,
      };
    }
  } catch {
    return {
      success: false,
      error: "Failed to generate QR code",
    };
  }
};
