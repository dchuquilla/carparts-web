// src/components/RequestsFilter.tsx
import React from "react";
import {
  Box, TextField, Stack, FormControl, InputLabel,
  Select, MenuItem, Button, IconButton, Tooltip
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { SelectChangeEvent } from "@mui/material/Select";
import { t } from "i18next";

export type RequestsFilterState = {
  part_name_cont: string;
  part_model_cont: string;
  part_brand_cont: string;
  part_year_eq: string;
  part_year_gteq: string;
  part_year_lteq: string;
  s: string;
};

export const DEFAULT_FILTERS: RequestsFilterState = {
  part_name_cont: "",
  part_model_cont: "",
  part_brand_cont: "",
  part_year_eq: "",
  part_year_gteq: "",
  part_year_lteq: "",
  s: "created_at desc",
};

export type RequestsMeta = {
  page: number;
  per_page: number;
  pages: number;
  count: number;
  car_brands: string[];  // e.g. ["Toyota","Kia"]
  car_models: string[];  // e.g. ["Corolla","Sportage"]
  car_years:  (number | string)[]; // e.g. [2004, 2005, "—"]
};

export function buildRansackSearchParams(filters: RequestsFilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.s?.trim()) p.set("q[s]", filters.s.trim());
  if (filters.part_name_cont.trim())  p.set("q[part_name_cont]", filters.part_name_cont.trim());
  if (filters.part_model_cont.trim()) p.set("q[part_model_cont]", filters.part_model_cont.trim());
  if (filters.part_brand_cont.trim()) p.set("q[part_brand_cont]", filters.part_brand_cont.trim());

  const y = (v: string) => /^\d{4}$/.test(v);
  if (y(filters.part_year_eq))   p.set("q[part_year_eq]", filters.part_year_eq);
  if (y(filters.part_year_gteq)) p.set("q[part_year_gteq]", filters.part_year_gteq);
  if (y(filters.part_year_lteq)) p.set("q[part_year_lteq]", filters.part_year_lteq);
  return p;
}

type Props = {
  value: RequestsFilterState;
  onChange: (next: RequestsFilterState) => void;
  onApply?: () => void;
  onReset?: () => void;
  showApplyButton?: boolean;
  requestMeta: RequestsMeta; // <-- new
};

const asYearString = (v: number | string) => String(v);

export const RequestsFilter: React.FC<Props> = ({
  value,
  onChange,
  onApply,
  onReset,
  showApplyButton = true,
  requestMeta
}) => {
  const { car_brands = [], car_models = [], car_years = [] } = requestMeta || {};

  const handleText =
    (key: keyof RequestsFilterState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [key]: e.target.value });

  const handleSort = (e: SelectChangeEvent<string>) =>
    onChange({ ...value, s: e.target.value });

  const reset = () => {
    onChange({ ...DEFAULT_FILTERS });
    onReset?.();
  };

  const yearOptions = car_years
    .map(asYearString)
    .filter((y) => /^\d{4}$/.test(y))
    .sort((a, b) => Number(b) - Number(a)); // newest first

  return (
    <Box component="form" noValidate sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, boxShadow: 1, bgcolor: "background.paper" }}>
      <Stack spacing={2}>
        {/* Free text name contains */}
        <Box sx={{ minWidth: 200, m: { xs: 0, sm: 1 } }}>
          <TextField
            label={t('requestFilter.partName.label')}
            value={value.part_name_cont}
            onChange={handleText("part_name_cont")}
            fullWidth size="small" placeholder={t('requestFilter.partName.placeholder')} autoComplete="off"
          />
        </Box>

        {/* Brand from meta (Autocomplete, freeSolo to allow unseen values) */}
        <Box sx={{ minWidth: 200, m: { xs: 0, sm: 1 } }}>
          <Autocomplete
            freeSolo
            options={car_brands}
            value={value.part_brand_cont}
            onChange={(_, newVal) => onChange({ ...value, part_brand_cont: newVal ?? "" })}
            onInputChange={(_, newInput) => onChange({ ...value, part_brand_cont: newInput })}
            renderInput={(params) => (
              <TextField {...params} label={t('requestFilter.partBrand.label')} size="small" placeholder={t('requestFilter.partBrand.placeholder')} />
            )}
          />
        </Box>

        {/* Model from meta */}
        <Box sx={{ minWidth: 200, m: { xs: 0, sm: 1 } }}>
          <Autocomplete
            freeSolo
            options={car_models}
            value={value.part_model_cont}
            onChange={(_, newVal) => onChange({ ...value, part_model_cont: newVal ?? "" })}
            onInputChange={(_, newInput) => onChange({ ...value, part_model_cont: newInput })}
            renderInput={(params) => (
              <TextField {...params} label={t('requestFilter.partModel.label')} size="small" placeholder={t('requestFilter.partModel.placeholder')} />
            )}
          />
        </Box>

        {/* Year EQ from meta */}
        <Box sx={{ minWidth: 200, m: { xs: 0, sm: 1 } }}>
          <Autocomplete
            options={yearOptions}
            value={value.part_year_eq}
            onChange={(_, v) => onChange({ ...value, part_year_eq: v ?? "" })}
            renderInput={(params) => (
              <TextField {...params} label={t('requestFilter.partYear.label')} size="small" placeholder={t('requestFilter.partYear.placeholder')} />
            )}
          />
        </Box>

        {/* Sort select */}
        <Box sx={{ minWidth: 200, m: { xs: 0, sm: 1 } }}>
          <FormControl sx={{ p: 1 }} fullWidth size="small">
            <InputLabel id="requests-sort-label">Sort</InputLabel>
            <Select labelId="requests-sort-label" label="Sort" value={value.s} onChange={handleSort}>
              <MenuItem value="created_at desc">Newest</MenuItem>
              <MenuItem value="created_at asc">Oldest</MenuItem>
              <MenuItem value="part_year desc">Year ↓</MenuItem>
              <MenuItem value="part_year asc">Year ↑</MenuItem>
              <MenuItem value="part_brand asc">Brand A–Z</MenuItem>
              <MenuItem value="part_brand desc">Brand Z–A</MenuItem>
              <MenuItem value="part_model asc">Model A–Z</MenuItem>
              <MenuItem value="part_model desc">Model Z–A</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Actions */}
        <Box sx={{ minWidth: 200, m: { xs: 0, sm: 1 } }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" sx={{ height: "100%" }}>
            <Tooltip title="Reset all filters">
              <IconButton onClick={reset} color="inherit">
                <ClearAllIcon />
              </IconButton>
            </Tooltip>
            {showApplyButton && (
              <Button variant="contained" onClick={onApply}>{t('requestFilter.apply')}</Button>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default RequestsFilter;