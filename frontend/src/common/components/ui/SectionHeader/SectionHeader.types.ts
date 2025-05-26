import {ComponentType} from "react";
import {SvgIconProps} from "@mui/material";

export interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    Icon?: ComponentType<SvgIconProps>;

}
