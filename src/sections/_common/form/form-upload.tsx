import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { RHFUpload } from "@/libs/components/hook-form";

import { useApi } from "@/hooks/use-apis";
import { API_ENDPOINTS } from "@/utils/axios";

export default function UploadForm({
  name,
  label,
  hideAlt,
}: {
  name: string;
  label: string;
  hideAlt?: boolean;
}) {
  const { watch, setValue } = useFormContext();

  const values = watch();

  const [alt, setAlt] = useState<string>("");
  const { data: uploadData, isLoading, postFormData: uploadFile } = useApi();

  useEffect(() => {
    if (values?.[name]) {
      const urlObject = new URL(values?.[name]);
      const { searchParams } = urlObject;
      if (searchParams.get("alt") && !alt) {
        setAlt(searchParams.get("alt") || "");
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (values?.[name]) {
      const urlObj = new URL(values?.[name]);
      urlObj.search = "";
      const result = urlObj.toString();
      setValue(name, `${result}?alt=${alt}`);
    }
    // eslint-disable-next-line
  }, [alt, values?.[name]]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        const form = new FormData();
        // @ts-ignore
        form.append("file", newFile, newFile.name.replaceAll(" ", "-"));
        uploadFile(API_ENDPOINTS.dashboard.uploadFile, form);
      }
    },
    [uploadFile]
  );

  const handleRemoveFile = useCallback(() => {
    setValue(name, null);
  }, [setValue, name]);

  const onAltChange = useCallback((ev: any) => {
    setAlt(ev.target.value);
  }, []);

  useEffect(() => {
    if (uploadData?.url) {
      setValue(name, uploadData.url, { shouldValidate: true });
    }
    // eslint-disable-next-line
  }, [uploadData]);

  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle2">{label}</Typography>
      <Stack direction="row" spacing={1}>
        <RHFUpload
          name={name}
          loading={isLoading}
          maxSize={52428800}
          onDrop={handleDrop}
          onDelete={handleRemoveFile}
          sx={{ flexGrow: 1 }}
        />
        {!hideAlt && (
          <TextField
            name={`${name}-alt`}
            label="Alt"
            value={alt}
            sx={{ flexGrow: 1 }}
            onChange={onAltChange}
            multiline
            rows={2}
          />
        )}
      </Stack>
    </Stack>
  );
}
