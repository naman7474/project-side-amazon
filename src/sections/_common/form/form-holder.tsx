import { enqueueSnackbar } from "notistack";
import { ReactNode, useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";

import FormProvider from "@/libs/components/hook-form";

import { useApi } from "@/hooks/use-apis";

export type FormHolderProps<T> = {
  entity: string;
  methods: UseFormReturn<any>;
  children: ReactNode;
  currentData?: T | null;
  onSubmit?: any;
  hideCard?: boolean;
  isLoading?: boolean;
  apiUrl?: string;
  onSuccess?: (data: Record<string, any>) => void;
  getPayload?: (formData: Record<string, any>) => T | Record<string, any>;
  disableSuccessMessage?: boolean;
};

const Holder = ({
  children,
  hideCard,
}: {
  children: ReactNode;
  hideCard?: boolean;
}) => {
  if (hideCard) {
    return <Box>{children}</Box>;
  }

  return <Card sx={{ p: 3 }}>{children}</Card>;
};

export default function FormHolder<T = Record<string, any>>({
  currentData,
  methods,
  onSubmit,
  hideCard,
  children,
  isLoading,
  entity,
  apiUrl,
  onSuccess,
  getPayload,
  disableSuccessMessage,
}: FormHolderProps<T>) {
  const { data, isLoading: loading, postData } = useApi();

  const { handleSubmit } = methods;

  const onFormSubmit = useCallback(
    async (formData: Record<string, any>) => {
      if (!apiUrl) {
        return;
      }

      const payload = getPayload
        ? (getPayload(formData) as Record<string, any>)
        : { ...(currentData || {}), ...formData };
      try {
        postData(apiUrl, payload);
      } catch (error) {
        console.error(error);
      }
    },
    [apiUrl, currentData, getPayload, postData]
  );

  useEffect(() => {
    if (data) {
      if (!disableSuccessMessage) {
        enqueueSnackbar(
          currentData
            ? `${entity} updated successfully!`
            : `${entity} created successfully!`
        );
      }
      if (onSuccess) {
        onSuccess(data);
      }
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <FormProvider
      methods={methods}
      onSubmit={apiUrl ? handleSubmit(onFormSubmit) : handleSubmit(onSubmit)}
    >
      <Grid container={!hideCard} spacing={3}>
        <Grid xs={12}>
          <Holder hideCard={hideCard}>
            <>
              {children}
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={loading || isLoading}
                >
                  {!currentData ? `Create ${entity || ""}` : "Save Changes"}
                </LoadingButton>
              </Stack>
            </>
          </Holder>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
