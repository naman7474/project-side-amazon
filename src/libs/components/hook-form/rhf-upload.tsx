import { useFormContext, Controller } from "react-hook-form";

import { Upload, UploadProps } from "../Upload";

interface Props extends Omit<UploadProps, "file"> {
  name: string;
  multiple?: boolean;
  loading?: boolean;
}

export function RHFUpload({ name, loading, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Upload
          file={field.value}
          error={!!error}
          loading={loading}
          {...other}
        />
      )}
    />
  );
}
