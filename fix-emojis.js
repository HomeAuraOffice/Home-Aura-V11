        const getWhatsAppPayloadText = (order, factoryId) => {
          if (!order) return '';
          const targetFactory = factories.value.find(f => f.id === factoryId) || factories.value[0];
          const factoryName = targetFactory ? targetFactory.name : 'Factory Partner';

          let payload = `🏭 *HOMEAURA PRODUCTION ORDER DISPATCH*\n`;
          payload += `━━━━━━━━━━━━━━━━━━━━━\n`;
          payload += `🏭 *Target Factory:* ${factoryName}\n`;
          payload += `🆔 *Order Ref:* ${order.id}\n`;
          payload += `📑 *Consignment No (CN):* ${order.cnNumber || 'N/A'}\n`;
          payload += `🧾 *Factory Invoice No:* ${order.invoiceNumber || 'N/A'}\n`;
          payload += `📅 *Date:* ${order.timestamp}\n`;
          payload += `🛋️ *Product:* ${order.productCategory} (${order.seatConfig})\n`;
          payload += `🧵 *Fabric:* ${order.fabric}\n`;
          payload += `👤 *Client Name:* ${order.customerName}\n`;
          payload += `📞 *Client Contact:* ${order.customerPhone}\n`;
          payload += `📍 *Delivery Address:* ${order.customerAddress}\n`;
          if (order.extraDetails) payload += `🔍 *Fabric & Specs:* ${order.extraDetails}\n`;
          if (order.notes) payload += `📝 *Special Notes:* ${order.notes}\n`;
          if (order.collagePhotoFileName) payload += `🖼️ *Local Attachment:* ${order.collagePhotoFileName}\n`;
          if (order.collagePhotoUrl && !order.collagePhotoUrl.startsWith('data:')) payload += `🖼️ *Collage Photo Link:* ${order.collagePhotoUrl}\n`;
          if (order.socialProofUrl && !order.socialProofUrl.startsWith('data:')) payload += `📸 *Payment Proof Link:* ${order.socialProofUrl}\n`;
          payload += `━━━━━━━━━━━━━━━━━━━━━\n`;
          return payload;
        };
