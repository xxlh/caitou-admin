import { max } from "lodash";
import React from "react";

export type WechatTemplateDataType = {
  key: string;
  id: number;
  no: number;
  affect_types: Array;
  title: string;
  description?: string;
  page?: string;
  data: Array<{
    name: string;
    key: string;
    type: string;
    max: number;
    value?: string;
  }>
}