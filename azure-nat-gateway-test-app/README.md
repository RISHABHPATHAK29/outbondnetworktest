# Azure NAT Gateway Test App

Small Node.js app for testing Azure App Service outbound traffic through an Azure NAT Gateway.

## Endpoints

- `/` - test page
- `/health` - health check
- `/ip` - calls `api.ipify.org` and returns the public outbound IP

## Azure configuration

1. Deploy this project to an Azure App Service.
2. Enable **VNet Integration** for the App Service.
3. Select a subnet dedicated to App Service VNet Integration.
4. Attach the **NAT Gateway** to that subnet.
5. Make sure the NAT Gateway has a Public IP / Public IP Prefix.
6. Browse to `/ip`.

Expected result:

```json
{
  "success": true,
  "outboundPublicIp": "YOUR_NAT_GATEWAY_PUBLIC_IP"
}
```

The important point is that the App Service must send outbound traffic through the integrated subnet. Simply creating a NAT Gateway in the VNet does not make App Service use it.
