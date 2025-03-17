"use client";

import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useApi } from "@/hooks/use-apis";
import { API_ENDPOINTS } from "@/utils/axios";

import { PageView } from "../_common/view";
import DashboardSeller from "./dashboard-seller";

const DashboardView = () => {
  const { data, isLoading, getData } = useApi();
  const [sellerId, setSellerId] = useState<string>("");

  const onSellerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSellerId(event.target.value as string);
  };

  const onAmazonClick = () => {
    const client_id = process.env.NEXT_PUBLIC_AMAZON_APP_ID;
    const redirect_uri = encodeURIComponent(
      "https://app.xpertseller.com/dashboard/oauth/amazon"
    );
    const scope = encodeURIComponent("sellingpartnerapi::migration");
    const state = encodeURIComponent("stateValue");
    const response_type = "code";
    window.location.href = `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}&version=beta&response_type=${response_type}`;
  };

  useEffect(() => {
    getData(API_ENDPOINTS.dashboard.partners.list);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data?.partners?.length) {
      setSellerId(data.partners[0].id);
    }
  }, [data?.partners]);

  return (
    <PageView
      heading="Overview"
      isLoading={isLoading}
      actions={
        <>
          {!!data?.partners?.length && (
            <TextField
              select
              sx={{ width: 240 }}
              onChange={onSellerChange}
              label="Select Amazon Account"
              defaultValue={data.partners[0].id}
            >
              {data?.partners?.map((partner: Record<string, any>) => (
                <MenuItem key={partner.id} value={partner.id}>
                  {partner.name}: {partner.sellerId}
                </MenuItem>
              ))}
              <MenuItem value="" onClick={onAmazonClick}>
                <b>+ Amazon Account</b>
              </MenuItem>
            </TextField>
          )}
        </>
      }
    >
      {sellerId ? (
        <DashboardSeller sellerId={sellerId} />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            flexDirection: "column",
            mt: 20,
          }}
        >
          {data?.partners?.length ? (
            <Typography variant="subtitle1" color="primary.main">
              Kindly select a seller account
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" color="primary.main">
                It seems you have not connected your seller account. Kindly
                connect your seller account
              </Typography>
              <Button
                variant="contained"
                onClick={onAmazonClick}
                sx={{ width: 240, mt: 2, mx: "auto" }}
              >
                Connect Amazon Account
              </Button>
            </>
          )}
        </Box>
      )}
    </PageView>
  );
};

export default DashboardView;
