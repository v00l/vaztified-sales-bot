const rpc = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_KEY}`

const getAsset = async (token: string) => {
  const response = await fetch(rpc, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAsset',
      params: {
        id: token
      },
    }),
  });
  const { result } = await response.json();
  return result;
};

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {

      const webhook: any = process.env.DISCORD_WEBHOOK

      let webhook_data = req.body

      console.log(webhook_data, 'e1')
      console.log(webhook_data[0].events.nft)
      console.log(webhook_data[0].events.nft.nfts[0])
      let token: any = await getAsset(webhook_data[0].events.nft.nfts[0].mint)

      const response = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

          "content": null,
          "embeds": [
            {
              "title": token.content.metadata.name + " has sold!",
              "url": `https://solscan.io/token/${webhook_data[0].events.nft.nfts[0].mint}`,
              "color": 16486972,
              "fields": [
                {
                  "name": "\ ",
                  "value": "\ "
                },
                {
                  "name": "\ ",
                  "value": "\ "
                },
                {
                  "name": ":moneybag:  Sale Price",
                  "value": "**" + (webhook_data[0].events.nft.amount / 1000000000).toFixed(2) + " " + "SOL**",
                  "inline": true
                },
                {
                  "name": ":date:  Sale Date",
                  "value": `<t:${webhook_data[0].timestamp}:R>`,
                  "inline": true
                },
                {
                  "name": "\ ",
                  "value": "\ "
                },
                {
                  "name": "Buyer",
                  "value": webhook_data[0].events.nft.buyer.slice(0, 4) + '..' + webhook_data[0].events.nft.buyer.slice(-4),
                  "inline": true
                },
                {
                  "name": "Seller",
                  "value": webhook_data[0].events.nft.seller.slice(0, 4) + '..' + webhook_data[0].events.nft.seller.slice(-4),
                  "inline": true
                }
              ],
              "image": {
                "url": token.content.files[0].uri
              },
              timestamp: new Date().toISOString(),
              "footer": {
                  "text": "PAPER PEEPS",
                  "icon_url": "https://prod-image-cdn.tensor.trade/images/400x400/freeze=false/https%3A%2F%2Fprod-tensor-creators-s3.s3.us-east-1.amazonaws.com%2Fimage%2F3392d6be-9535-4cee-a8e5-064cd9f009bb",
              }
            }
          ],

        },
        ),
      });
      console.log(response)
      res.status(200).json("success")

    };

  }

  catch (err) { console.log(err) }

}
