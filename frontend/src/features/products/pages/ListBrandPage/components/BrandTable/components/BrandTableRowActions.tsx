import {useCallback} from "react";
import {Box, IconButton, Tooltip} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useDeactivateBrand} from "../../../../../hooks/brands/useDeactivateBrand.ts";
import {useNotifications} from "../../../../../../../common/hooks/useNotifications.ts";

export const BrandTableRowActions = ({ row, table }) => {

    const { confirmAction } = useNotifications();
    const deactivateBrand = useDeactivateBrand();


    const openDeactivateConfirmModal = useCallback(async(row) => {
        const { name, id } = row.original;
        
        await confirmAction({
            title: '¿Estás seguro?',
            text: `Se desactivará la marca ${name}`,
            onConfirm: () => {
                deactivateBrand.mutate(id)
            },
            loadingMessage: "Desactivando marca..."
        })
    }, [confirmAction, deactivateBrand])

    return (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip title="Editar marca">
                <IconButton onClick={() => table.setEditingRow(row)}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Desactivar Marca">
                <IconButton loading={deactivateBrand.isPending} color="error" onClick={() => openDeactivateConfirmModal(row)}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </Box>
    )
}