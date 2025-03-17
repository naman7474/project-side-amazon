"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useApi } from "@/hooks/use-apis";

import { PageView } from "../_common/view";
import { API_ENDPOINTS } from "@/utils/axios";

const AmazonOauthView = () => {
  const searchParams = useSearchParams();
  const { data, isLoading, getData } = useApi();

  useEffect(() => {
    const code = searchParams.get("spapi_oauth_code");
    const partnerId = searchParams.get("selling_partner_id");
    if (code && partnerId) {
      getData(
        `${API_ENDPOINTS.oauth.amazon}?spapi_oauth_code=${code}&selling_partner_id=${partnerId}`
      );
    }
    // eslint-disable-next-line
  }, []);

  return (
    <PageView heading="" isLoading={isLoading}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          flexDirection: "column",
          mt: 20,
        }}
      >
        {!data ? (
          <Typography variant="subtitle1" color="primary.main">
            Something went wrong. Please try again.
          </Typography>
        ) : (
          <Typography variant="subtitle1" color="primary.main">
            It would take some time to update the data. Kindly come back later.
          </Typography>
        )}
      </Box>
    </PageView>
  );
};

export default AmazonOauthView;
