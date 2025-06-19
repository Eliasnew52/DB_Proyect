import {ContentContainer} from "../../../../../../../common/components/ui/ContentContainer.tsx";
import CountUp from "react-countup";
import {Typography} from "@mui/material";

export const SummaryCard = ({ label, value, prefix }: { label?: string, prefix?: string, value: number }) => {
    return (
        <ContentContainer
            sx={{
                gap: 0
            }}
            width={'100%'}
        >
            <Typography
                fontSize={14}
                color={'grey.600'}
            >
                { label }
            </Typography>
            <Typography fontWeight="bold" fontSize={25}>
                <CountUp prefix={prefix} end={value ?? 0} />
            </Typography>
        </ContentContainer>
    )
}