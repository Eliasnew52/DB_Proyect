import {MRT_ColumnDef} from "material-react-table";
import {Grid, Typography} from "@mui/material";
import {ProductActivityLog} from "../../../../../../../domain/ProductActivityLog.types.ts";
import {formatDate} from "../../../../../../../../../common/utils/formatDate.ts";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import {formatPrice} from "../../../../../../../../../common/utils/formatPrice.ts";
import React from "react";

export const ActivityLogTableColumns: MRT_ColumnDef<ProductActivityLog>[] = [
    {
        accessorKey: 'history_date',
        header: 'Fecha',
        size: 150,
        accessorFn: (row) => formatDate(row.history_date)
    },
    {
        accessorKey: 'history_change_reason',
        header: 'Actividad',
        size: 150,
        Cell: ({row}) => {
            const { changes, history_change_reason } = row.original;
            const activity = history_change_reason?.split('; ') ?? []
            return (
                <Grid
                    container
                    spacing={1}
                    flexDirection={'column'}
                >
                    {
                        changes.length > 0 ? changes.map((change, index) => (
                            <Grid
                                key={`${change.field}-${index}`}
                                container
                                spacing={1}
                                alignItems={'center'}
                            >
                                {
                                    change.field === 'sale_price' ? (
                                        <AttachMoneyIcon />
                                    ) : change.field === 'stock' ? (
                                        <Inventory2OutlinedIcon />
                                    ) : change.field === 'name' ? (
                                        <InfoOutlineIcon />
                                    ) : change.field === 'brand' ? (
                                        <LocalOfferOutlinedIcon />
                                    ) : change.field === 'image' ? (
                                        <ImageOutlinedIcon />
                                    ) : change.field === 'category' ? (
                                        <CategoryOutlinedIcon />
                                    ) : change.field === 'suppliers' ? (
                                        <LocalShippingOutlinedIcon />
                                    ) : change.field === 'description' ? (
                                        <InfoOutlineIcon />
                                    ) : change.field === 'purchase_price' ? (
                                        <AttachMoneyIcon />
                                    ) : change.field === 'minimum_stock' ? (
                                        <Inventory2OutlinedIcon />
                                    ) : change.field === 'active' ? (
                                        <MonitorHeartOutlinedIcon />
                                    ) : change.field === 'weight' ? (
                                        <FitnessCenterOutlinedIcon />
                                    ) : (
                                        <StraightenOutlinedIcon />
                                    )
                                }

                                { activity[index] }
                            </Grid>
                        )) : (
                            <>
                                {
                                    activity?.map((reason, index) => (
                                        <React.Fragment
                                            key={`${reason}-${index}`}
                                        >
                                            { reason }
                                        </React.Fragment>
                                    ))
                                }
                            </>
                        )
                    }
                </Grid>
            )
        }
    },
    {
        accessorKey: 'changes',
        header: 'Cambios',
        size: 150,
        Cell: ({row}) => {
            const { changes } = row.original;



            return (
                changes.map(change => {
                    const isPrice = change.field === 'purchase_price' ||
                        change.field === 'sale_price';

                    return (
                        <Grid
                            container
                            spacing={1}
                        >
                            <Typography
                                color={'error'}
                                fontSize={14}
                            >
                                {
                                    typeof change.old === 'number' &&
                                    isPrice ?
                                        formatPrice(change.old) :
                                        Array.isArray(change.old) ?
                                            change.old.join(', ') :
                                            typeof change.old === 'boolean' ?
                                                change.old ? 'Activo' : 'Inactivo' :
                                                change.old
                                }
                            </Typography>
                            →
                            <Typography
                                color={'success'}
                                fontSize={14}

                            >
                                {
                                    typeof change.new === 'number' &&
                                    isPrice ?
                                        formatPrice(change.new) :
                                        Array.isArray(change.new) ?
                                            change.new.join(', ') :
                                            typeof change.old === 'boolean' ?
                                                change.old ? 'Activo' : 'Inactivo' :
                                                change.old
                                }
                            </Typography>
                        </Grid>
                    )
                })
            )
        }
    },
    {
        accessorKey: 'history_user.username',
        header: 'Creado por',
        size: 150,
    },
];