import {Grid, Skeleton, Typography} from "@mui/material";
import {ContentContainer} from "../../../../../../../../../common/components/ui/ContentContainer.tsx";

export const SalesMetricCardSkeleton = () => {
  return (
      <ContentContainer>
          <Grid
              container
              flexDirection={'column'}
              spacing={0}
          >
              <Grid>
                  <Typography
                      fontWeight={'bold'}
                      fontSize={25}
                  >
                      <Skeleton />
                  </Typography>
              </Grid>
              <Grid>
                  <Typography
                      fontSize={14}
                      color={'grey.600'}
                  >
                      <Skeleton />
                  </Typography>
              </Grid>
          </Grid>
      </ContentContainer>
  );
};