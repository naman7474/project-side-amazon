import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { RHFTextField } from "@/libs/components/hook-form";
import { slugify } from "@/libs/utils/string";

export default function SlugForm({
  fieldName,
  label = "Url*",
  name = "slug",
}: {
  fieldName: string;
  label?: string;
  name?: string;
}) {
  const { watch, setValue } = useFormContext();
  const values = watch();

  const enableSlugGeneration = useRef(!values?.[name]);

  useEffect(() => {
    if (values?.[fieldName] && enableSlugGeneration.current) {
      setValue(name, slugify(values?.[fieldName]));
    }
    // eslint-disable-next-line
  }, [values?.[fieldName]]);

  const onSlugChange = useCallback(
    (ev: any) => {
      setValue(name, ev.target.value);
    },
    [name, setValue]
  );

  return (
    <RHFTextField name={name} label={label} onChange={onSlugChange} fullWidth />
  );
}
